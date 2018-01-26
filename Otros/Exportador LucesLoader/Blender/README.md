## Descripción
Exportador en formato JSON de las luces de Blender.

Actualmente solo soporta el renderizador Blender render y los tipos de luces:
* Spot
* Point
* Ambient

Para cargar el archivo JSON, existe un importador, `Puente.LoaderLuces`.

## Instalación
El script se instala como un addon de Blender, ya sea desde el botón de instalar en Blender o introduciendo el archivo `.py` en `Blender\2.79\scripts\addons\` (Windows)

## Uso
En el visor 3D, pulsa espacio y en el buscador escribe `Exportar luces Puente`.

La versión actual copia todo el texto en formato `.json` en el portapapeles.
