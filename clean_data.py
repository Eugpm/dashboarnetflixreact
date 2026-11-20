"""
Fase 3 · Preprocesamiento reproducible (reglas definidas en la Fase 1, sección 5.2).

Entrada : data/raw/netflix_titles.csv  (Kaggle · Netflix Movies and TV Shows)
Salida  : public/data/netflix.json     (títulos + relaciones, listo para React)
          public/data/quality_report.json

Uso: python3 scripts/clean_data.py
"""
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "netflix_titles.csv"
OUT = ROOT / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)

# País (como aparece en el CSV) -> (ISO alpha-2, ISO numérico). El numérico enlaza con el mapa.
COUNTRIES = {
    "Afghanistan": ("AF", "004"), "Albania": ("AL", "008"), "Algeria": ("DZ", "012"),
    "Angola": ("AO", "024"), "Argentina": ("AR", "032"), "Armenia": ("AM", "051"),
    "Australia": ("AU", "036"), "Austria": ("AT", "040"), "Azerbaijan": ("AZ", "031"),
    "Bahamas": ("BS", "044"), "Bangladesh": ("BD", "050"), "Belarus": ("BY", "112"),
    "Belgium": ("BE", "056"), "Bermuda": ("BM", "060"), "Botswana": ("BW", "072"),
    "Brazil": ("BR", "076"), "Bulgaria": ("BG", "100"), "Cambodia": ("KH", "116"),
    "Canada": ("CA", "124"), "Cayman Islands": ("KY", "136"), "Chile": ("CL", "152"),
    "China": ("CN", "156"), "Colombia": ("CO", "170"), "Croatia": ("HR", "191"),
    "Cuba": ("CU", "192"), "Cyprus": ("CY", "196"), "Czech Republic": ("CZ", "203"),
    "Denmark": ("DK", "208"), "Dominican Republic": ("DO", "214"), "Ecuador": ("EC", "218"),
    "Egypt": ("EG", "818"), "Finland": ("FI", "246"), "France": ("FR", "250"),
    "Georgia": ("GE", "268"), "Germany": ("DE", "276"), "Ghana": ("GH", "288"),
    "Greece": ("GR", "300"), "Guatemala": ("GT", "320"), "Hong Kong": ("HK", "344"),
    "Hungary": ("HU", "348"), "Iceland": ("IS", "352"), "India": ("IN", "356"),
    "Indonesia": ("ID", "360"), "Iran": ("IR", "364"), "Iraq": ("IQ", "368"),
    "Ireland": ("IE", "372"), "Israel": ("IL", "376"), "Italy": ("IT", "380"),
    "Jamaica": ("JM", "388"), "Japan": ("JP", "392"), "Jordan": ("JO", "400"),
    "Kazakhstan": ("KZ", "398"), "Kenya": ("KE", "404"), "Kuwait": ("KW", "414"),
    "Latvia": ("LV", "428"), "Lebanon": ("LB", "422"), "Liechtenstein": ("LI", "438"),
    "Lithuania": ("LT", "440"), "Luxembourg": ("LU", "442"), "Malawi": ("MW", "454"),
    "Malaysia": ("MY", "458"), "Malta": ("MT", "470"), "Mauritius": ("MU", "480"),
    "Mexico": ("MX", "484"), "Mongolia": ("MN", "496"), "Montenegro": ("ME", "499"),
    "Morocco": ("MA", "504"), "Namibia": ("NA", "516"), "Nepal": ("NP", "524"),
    "Netherlands": ("NL", "528"), "New Zealand": ("NZ", "554"), "Nicaragua": ("NI", "558"),
    "Nigeria": ("NG", "566"), "Norway": ("NO", "578"), "Pakistan": ("PK", "586"),
    "Panama": ("PA", "591"), "Paraguay": ("PY", "600"), "Peru": ("PE", "604"),
    "Philippines": ("PH", "608"), "Poland": ("PL", "616"), "Portugal": ("PT", "620"),
    "Puerto Rico": ("PR", "630"), "Qatar": ("QA", "634"), "Romania": ("RO", "642"),
    "Russia": ("RU", "643"), "Samoa": ("WS", "882"), "Saudi Arabia": ("SA", "682"),
    "Senegal": ("SN", "686"), "Serbia": ("RS", "688"), "Singapore": ("SG", "702"),
    "Slovakia": ("SK", "703"), "Slovenia": ("SI", "705"), "Somalia": ("SO", "706"),
    "South Africa": ("ZA", "710"), "South Korea": ("KR", "410"), "Spain": ("ES", "724"),
    "Sri Lanka": ("LK", "144"), "Sudan": ("SD", "729"), "Sweden": ("SE", "752"),
    "Switzerland": ("CH", "756"), "Syria": ("SY", "760"), "Taiwan": ("TW", "158"),
    "Thailand": ("TH", "764"), "Turkey": ("TR", "792"), "Uganda": ("UG", "800"),
    "Ukraine": ("UA", "804"), "United Arab Emirates": ("AE", "784"),
    "United Kingdom": ("GB", "826"), "United States": ("US", "840"), "Uruguay": ("UY", "858"),
    "Vatican City": ("VA", "336"), "Venezuela": ("VE", "862"), "Vietnam": ("VN", "704"),
    "Zimbabwe": ("ZW", "716"),
}
# Entidades históricas: no se reasignan a un país actual (no se inventan datos).
HISTORICAL = {"Soviet Union", "East Germany", "West Germany"}


def split_multi(value):
    """Regla 6: separar por comas, limpiar espacios y deduplicar dentro del título."""
    if pd.isna(value):
        return []
    seen, out = set(), []
    for part in str(value).split(","):
        part = part.strip()
        if part and part not in seen:
            seen.add(part)
            out.append(part)
    return out


def main():
    raw = pd.read_csv(RAW)
    report = {"filas_originales": int(len(raw)), "columnas": int(raw.shape[1])}
    report["nulos_por_campo"] = {k: int(v) for k, v in raw.isna().sum().items()}

    # Regla 2: identificadores
    report["show_id_vacios"] = int(raw.show_id.isna().sum())
    report["show_id_duplicados"] = int(raw.show_id.duplicated().sum())
    df = raw.dropna(subset=["show_id"]).drop_duplicates("show_id").copy()

    # Regla 3: textos y categorías
    for col in ["type", "title", "director", "country", "listed_in", "rating", "duration"]:
        df[col] = df[col].astype("string").str.strip()
    df["type"] = df["type"].replace({"movie": "Movie", "tv show": "TV Show"})
    df = df[df["type"].isin(["Movie", "TV Show"])]

    # Regla 5: fechas
    added = pd.to_datetime(df["date_added"].astype("string").str.strip(), format="%B %d, %Y", errors="coerce")
    df["added_year"] = added.dt.year
    report["date_added_invalidas_o_nulas"] = int(added.isna().sum())
    df["release_year"] = pd.to_numeric(df["release_year"], errors="coerce")
    bad_years = df["release_year"].isna() | (df["release_year"] < 1900) | (df["release_year"] > datetime.now().year)
    report["release_year_fuera_de_rango"] = int(bad_years.sum())
    df.loc[bad_years, "release_year"] = pd.NA

    # Regla 7: duración (valor + unidad compatibles con type)
    dur = df["duration"].str.extract(r"^(\d+)\s*(\w+)")
    df["dur_value"] = pd.to_numeric(dur[0], errors="coerce")
    df["dur_unit"] = dur[1].str.lower().str.rstrip("s")
    incompatibles = ((df.type == "Movie") & (df.dur_unit != "min")) | ((df.type == "TV Show") & (df.dur_unit != "season"))
    report["duracion_incompatible_con_tipo"] = int(incompatibles.sum())

    # Regla 6: multivalor
    country_rel, genre_rel, director_rel = [], [], []
    ignored_hist, unknown_countries = 0, set()
    titles = []
    genres_idx = {}
    for row in df.itertuples():
        codes = []
        for name in split_multi(row.country):
            if name in COUNTRIES:
                code = COUNTRIES[name][0]
                if code not in codes:
                    codes.append(code)
            elif name in HISTORICAL:
                ignored_hist += 1
            else:
                unknown_countries.add(name)
        genres = []
        for g in split_multi(row.listed_in):
            genres_idx.setdefault(g, len(genres_idx))
            genres.append(genres_idx[g])
        directors = split_multi(row.director)
        country_rel.append(len(codes)); genre_rel.append(len(genres)); director_rel.append(len(directors))
        titles.append({
            "id": row.show_id,
            "type": "M" if row.type == "Movie" else "S",
            "year": None if pd.isna(row.release_year) else int(row.release_year),
            "added": None if pd.isna(row.added_year) else int(row.added_year),
            "countries": codes,
            "genres": genres,
            "directors": directors,
        })

    report.update({
        "titulos_finales": len(titles),
        "relaciones_titulo_pais": int(sum(country_rel)),
        "relaciones_titulo_genero": int(sum(genre_rel)),
        "relaciones_titulo_director": int(sum(director_rel)),
        "etiquetas_pais_historicas_omitidas": ignored_hist,
        "paises_sin_mapear": sorted(unknown_countries),
        "titulos_sin_pais": int(sum(1 for c in country_rel if c == 0)),
        "titulos_sin_director": int(sum(1 for c in director_rel if c == 0)),
    })

    used = sorted({c for t in titles for c in t["countries"]})
    by_code = {v[0]: (k, v[1]) for k, v in COUNTRIES.items()}
    payload = {
        "meta": {
            "source": "Kaggle · Netflix Movies and TV Shows (shivamb)",
            "generated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "titles": len(titles),
            "minYear": int(df.release_year.min()),
            "maxYear": int(df.release_year.max()),
        },
        "countries": {c: {"name": by_code[c][0], "num": by_code[c][1]} for c in used},
        "genres": [g for g, _ in sorted(genres_idx.items(), key=lambda kv: kv[1])],
        "titles": titles,
    }
    (OUT / "netflix.json").write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (OUT / "quality_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
