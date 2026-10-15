# Nordic solar & wind

A one-page dashboard of solar and wind buildout in Denmark, Finland, Norway and Sweden: installed capacity and electricity generation from 2000 to 2025, with industry estimates to 2030.

**Live site:** https://andreasn.github.io/nordic-renewables/

## Data

| File | What it holds | Source |
|---|---|---|
| `data/nordic_capacity_irena.csv` | Installed solar and wind capacity (MW), 2000–2025 | IRENA Renewable Energy Statistics 2026, via Our World in Data |
| `data/nordic_generation_eurostat.csv` | Solar and wind gross electricity production (GWh), 2000–2024 | Eurostat `nrg_bal_peh` |
| `data/nordic_outlook_2030.csv` | Industry 2030 capacity forecasts (MW) | WindEurope outlook 2026–2030 (Feb 2026); SolarPower Europe 2023 and DNV ETO, as cited by DNV (Feb 2024) |
| `data/nordic_outlook_annual.csv` | Projected capacity by year, 2026–2030 (MW) | Wind: WindEurope's yearly installations added to IRENA 2025. Solar: straight line from IRENA 2025 to the 2030 forecast |

The 2030 generation estimate is calculated in the page: forecast 2030 capacity × each country's average 2022–24 capacity factor, with a range from the weakest and strongest of those years.

## Running locally

The page loads its CSVs with `fetch`, so serve the folder rather than opening the file directly:

```sh
python3 -m http.server
```

To update the numbers, replace the CSV files, keeping the same column names.
