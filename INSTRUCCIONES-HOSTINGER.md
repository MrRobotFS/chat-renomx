# 🚀 Instrucciones para subir Chat RenoMX a Hostinger

## 📁 ARCHIVOS PARA SUBIR

### Solo necesitas subir el contenido de la carpeta `out/`:
```
📂 out/
├── 📄 index.html (página principal de login)
├── 📄 404.html (página de error) 
├── 📄 renovables-logo.png (logo)
├── 📂 chat/ 
│   └── 📄 index.html (página de chat)
└── 📂 _next/ (archivos CSS y JavaScript optimizados)
    ├── 📂 static/
    └── otros archivos...
```

## 🔧 PASOS PARA SUBIR A HOSTINGER

### Paso 1: Acceder al File Manager de Hostinger
1. Entra a tu panel de Hostinger  
2. Ve a "File Manager" o "Administrador de archivos"
3. Navega a `root/web/` (tu estructura de carpetas)

### Paso 2: Crear carpeta chatbot
1. En `root/web/` crea una carpeta llamada `chatbot`
2. Entra a la carpeta `chatbot` 

### Paso 3: Subir archivos
1. **Selecciona TODO el contenido de la carpeta `out/`** (NO la carpeta `out`, sino su contenido)
2. Arrastra y suelta en `root/web/chatbot/`
3. O usa "Upload" y selecciona todos los archivos de `out/`

### Estructura final en tu servidor:
```
root/
└── web/
    └── chatbot/
        ├── index.html (login)
        ├── 404.html  
        ├── renovables-logo.png
        ├── chat/
        │   └── index.html (página de chat)
        └── _next/
            └── (archivos CSS/JS)
```

## 🌐 URLs de tu sitio

Después de subir, tu sitio estará disponible en:
- **Login (página principal)**: `https://renovablesdelsur.mx/chatbot/`
- **Chat**: `https://renovablesdelsur.mx/chatbot/chat/`

## ⚙️ CONFIGURACIÓN IMPORTANTE

### Cambiar URL del servidor Django:
Antes de usar en producción, edita el archivo `next.config.js` línea 11:
```javascript
NEXT_PUBLIC_API_BASE_URL: 'https://TU-SERVIDOR-DJANGO-REAL.com',
```

Luego vuelve a ejecutar:
```bash
npm run build
```

Y sube nuevamente los archivos de `out/`.

## 🔍 VERIFICACIÓN

Después de subir:
1. Ve a `https://tu-dominio.com/` - debe cargar la página de login
2. Ve a `https://tu-dominio.com/chat/` - debe cargar el chat
3. Si algo no funciona, revisa que todos los archivos estén en `public_html/`

## 📞 SOLUCIÓN DE PROBLEMAS

### Problema: Página en blanco
**Solución**: Asegúrate de que `index.html` está directamente en `public_html/`

### Problema: CSS no carga (página sin estilos)
**Solución**: Asegúrate de que la carpeta `_next/` está completa en `public_html/`

### Problema: Chat no funciona
**Solución**: Verifica que la URL del servidor Django en `next.config.js` sea correcta

## ✅ TAMAÑO TOTAL DE ARCHIVOS: ~3-5 MB