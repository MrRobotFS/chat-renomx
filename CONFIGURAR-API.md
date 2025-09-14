# 🔧 Configuración de API para el Login

## ❌ PROBLEMA ACTUAL

El frontend está intentando hacer login a:
```
https://renovablesdelsur.mx/api/chatbot/employee/login/
```

Pero está recibiendo HTML en lugar de JSON, lo que significa que esa URL no sirve el API de Django.

## 🎯 SOLUCIONES POSIBLES

### Opción 1: Django en puerto 8000
Si tu Django está en el puerto 8000:
```javascript
NEXT_PUBLIC_API_BASE_URL: 'https://renovablesdelsur.mx:8000'
```

### Opción 2: Django en subdominio
Si tienes un subdominio para la API:
```javascript
NEXT_PUBLIC_API_BASE_URL: 'https://api.renovablesdelsur.mx'
```

### Opción 3: Django en subcarpeta
Si Django está en una subcarpeta como `/api/`:
```javascript
NEXT_PUBLIC_API_BASE_URL: 'https://renovablesdelsur.mx'
```
Y cambiar el código para usar `/api/` en lugar de `/api/chatbot/`

### Opción 4: Servidor diferente
Si Django está en otro servidor:
```javascript
NEXT_PUBLIC_API_BASE_URL: 'https://tu-servidor-django.com'
```

## 🛠️ CÓMO CAMBIAR LA CONFIGURACIÓN

1. **Editar `next.config.js` línea 18:**
```javascript
NEXT_PUBLIC_API_BASE_URL: 'TU-URL-CORRECTA-AQUI'
```

2. **Rebuild:**
```bash
npm run build
```

3. **Subir archivos nuevos de `out/`**

## 🧪 CÓMO PROBAR LA URL CORRECTA

### Método 1: Navegador
Ve directamente a estas URLs en tu navegador:

- `https://renovablesdelsur.mx:8000/api/chatbot/employee/login/`
- `https://renovablesdelsur.mx/api/chatbot/employee/login/`  
- `https://api.renovablesdelsur.mx/api/chatbot/employee/login/`

**Si ves algo como:** "Method GET not allowed" o "404" = URL correcta pero método incorrecto ✅
**Si ves:** HTML o página web = URL incorrecta ❌

### Método 2: Terminal/CMD
```bash
curl -X POST https://renovablesdelsur.mx:8000/api/chatbot/employee/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"numero123"}'
```

**Respuesta correcta:** JSON con error o éxito ✅
**Respuesta incorrecta:** HTML ❌

## ❓ NECESITO SABER

1. **¿Dónde está corriendo tu servidor Django?**
   - ¿Mismo servidor que la web?
   - ¿Puerto específico?
   - ¿Subdominio?

2. **¿Puedes acceder a Django admin?**
   - ¿En qué URL?

3. **¿Tienes configurado CORS en Django?**
   - Para permitir requests desde `renovablesdelsur.mx`

Una vez que me digas la URL correcta, actualizo la configuración y regeneramos los archivos.