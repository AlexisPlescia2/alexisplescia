"""
Limpieza y auditoría de un relevamiento de frío alimentario cargado en 3 versiones
por distintos editores.

Qué hace:
  1. Normaliza cada versión (tienda, tipo de mueble, cantidad, fecha).
  2. Elimina duplicados y filas de tiendas que no existen en el maestro.
  3. Compara las 3 versiones tienda por tienda y marca los cambios anómalos.
  4. Arma la base limpia (última versión válida) y un reporte de calidad.

Datos 100% ficticios. La lógica es la que usé en un caso real.
Uso:  python limpieza_relevamiento.py
"""
import re
from pathlib import Path
import pandas as pd

CARPETA = Path(__file__).parent / "datos"
SALIDA = Path(__file__).parent / "resultado"
SALIDA.mkdir(exist_ok=True)

MUEBLES_VALIDOS = ["Pozo BT", "Isla BT", "Mural MT", "Mural lácteos", "Cámara MT", "Cámara BT"]
UMBRAL_SALTO = 3.0   # una cantidad que se multiplica por 3 o más entre versiones se marca como anómala

log = []

def registrar(version, regla, filas):
    log.append({"Versión": version, "Regla": regla, "Filas afectadas": int(filas)})


def normalizar_tienda(valor):
    """'Tda 46', 'T-0046', ' TIENDA 46 ', '46' -> 'Tienda 46'."""
    numeros = re.findall(r"\d+", str(valor))
    return f"Tienda {int(numeros[0])}" if numeros else None


def normalizar_mueble(valor):
    """Compara sin mayúsculas ni espacios extra contra la lista de muebles válidos."""
    limpio = " ".join(str(valor).split()).lower()
    for m in MUEBLES_VALIDOS:
        if m.lower() == limpio:
            return m
    return None


def normalizar_cantidad(valor):
    """'12', '12 u.', 12 -> 12. Lo que no es número queda vacío."""
    numeros = re.findall(r"\d+", str(valor))
    return int(numeros[0]) if numeros else None


def normalizar_fecha(valor):
    """Acepta 15/05/2026, 2026-05-15 y 15-05-26."""
    for formato in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%y"):
        fecha = pd.to_datetime(str(valor), format=formato, errors="coerce")
        if pd.notna(fecha):
            return fecha.date()
    return None


def limpiar(version, maestro):
    df = pd.read_excel(CARPETA / f"relevamiento_frio_v{version}_ficticio.xlsx")
    total = len(df)

    df["Tienda"] = df["Tienda"].map(normalizar_tienda)
    df["Tipo de mueble"] = df["Tipo de mueble"].map(normalizar_mueble)
    texto = df["Cantidad"].map(lambda v: isinstance(v, str)).sum()
    df["Cantidad"] = df["Cantidad"].map(normalizar_cantidad)
    df["Fecha de carga"] = df["Fecha de carga"].map(normalizar_fecha)
    registrar(version, "Cantidades cargadas como texto ('12 u.') convertidas a número", texto)

    duplicados = df.duplicated(["Tienda", "Tipo de mueble"], keep="last").sum()
    df = df.drop_duplicates(["Tienda", "Tipo de mueble"], keep="last")
    registrar(version, "Duplicados eliminados (misma tienda y mueble)", duplicados)

    fuera_maestro = ~df["Tienda"].isin(maestro["Tienda"])
    registrar(version, "Tiendas que no existen en el maestro", fuera_maestro.sum())
    df = df[~fuera_maestro]

    vacios = df[["Tienda", "Tipo de mueble", "Cantidad"]].isna().any(axis=1)
    registrar(version, "Filas sin tienda, mueble o cantidad válidos", vacios.sum())
    df = df[~vacios]

    registrar(version, "Filas válidas", len(df))
    print(f"v{version}: {total} filas leídas -> {len(df)} válidas")
    return df.set_index(["Tienda", "Tipo de mueble"])


def main():
    maestro = pd.read_excel(CARPETA / "maestro_tiendas_ficticio.xlsx")
    v = {n: limpiar(n, maestro) for n in (1, 2, 3)}

    comparacion = pd.concat({f"v{n}": v[n]["Cantidad"] for n in v}, axis=1).reset_index()
    comparacion["Cambió"] = comparacion[["v1", "v2", "v3"]].nunique(axis=1) > 1
    comparacion["Factor v1→v3"] = (comparacion["v3"] / comparacion["v1"]).round(2)
    comparacion["Anómalo"] = (comparacion["Factor v1→v3"] >= UMBRAL_SALTO) | (comparacion["Factor v1→v3"] <= 1 / UMBRAL_SALTO)

    anomalos = comparacion[comparacion["Anómalo"]]
    base_limpia = v[3].reset_index().merge(maestro, on="Tienda")
    base_limpia["Requiere validación en tienda"] = base_limpia.set_index(["Tienda", "Tipo de mueble"]).index.isin(
        anomalos.set_index(["Tienda", "Tipo de mueble"]).index)

    with pd.ExcelWriter(SALIDA / "base_limpia_y_reporte.xlsx") as xw:
        pd.DataFrame({"Aviso": ["Datos ficticios generados para el portfolio. La lógica es real."]}).to_excel(xw, sheet_name="LEEME", index=False)
        base_limpia.to_excel(xw, sheet_name="Base limpia", index=False)
        comparacion.to_excel(xw, sheet_name="Comparacion v1-v2-v3", index=False)
        anomalos.to_excel(xw, sheet_name="Cambios anomalos", index=False)
        pd.DataFrame(log).to_excel(xw, sheet_name="Log de limpieza", index=False)

    print(f"\nCombinaciones tienda/mueble: {len(comparacion)} · con cambios: {comparacion['Cambió'].sum()} · anómalas: {len(anomalos)}")
    print(anomalos[["Tienda", "Tipo de mueble", "v1", "v2", "v3", "Factor v1→v3"]].to_string(index=False))
    print(f"\nResultado en {SALIDA / 'base_limpia_y_reporte.xlsx'}")


if __name__ == "__main__":
    main()
