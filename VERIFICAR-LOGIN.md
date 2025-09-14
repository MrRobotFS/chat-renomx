# 🔍 Verificación del Login - URL Corregida

## ✅ CONFIGURACIÓN ACTUALIZADA

Ahora el frontend intentará hacer login a:
```
https://renovablesdelsurmx.online:8443/api/chatbot/employee/login/
```

## 🧪 PRUEBA RÁPIDA

**Abre tu navegador y ve a:**
```
https://renovablesdelsurmx.online:8443/api/chatbot/employee/login/
```

### Respuestas esperadas:
- **✅ CORRECTO**: "Method GET not allowed" o JSON con error
- **❌ INCORRECTO**: Página HTML o error 404

## 🚀 PASOS PARA APLICAR

1. **Los nuevos archivos están listos en `out/`**
2. **Sube el contenido de `out/` a `root/web/chatbot/`**
3. **Reemplaza todos los archivos anteriores**
4. **Prueba el login en `https://renovablesdelsur.mx/chatbot/`**

## 🔧 SI AÚN HAY PROBLEMAS

Es posible que necesites configurar **CORS** en tu servidor Django para permitir requests desde `renovablesdelsur.mx`.

En tu `settings.py` de Django, asegúrate de tener:
```python
CORS_ALLOWED_ORIGINS = [
    "https://renovablesdelsur.mx",
]

CORS_ALLOW_CREDENTIALS = True
```

## 🎯 URL FINAL DE PRUEBA

Después de subir los archivos, el login debería funcionar en:
```
https://renovablesdelsur.mx/chatbot/
```

Con credenciales: `admin` / `numero123`