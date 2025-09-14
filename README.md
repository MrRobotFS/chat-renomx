# Chat RenovMX

Una interfaz de chatbot moderna y responsive para Renovables del Sur México, construida con Next.js 14, TypeScript y Tailwind CSS.

## Características

- 🎨 **Diseño Inspirado en Gemini**: Interfaz similar al chatbot de Google Gemini
- 🌓 **Modo Oscuro/Claro**: Soporte completo para temas con interruptor de usuario
- 📱 **Totalmente Responsive**: Optimizado para móvil, tablet y escritorio
- 🎯 **Branding Corporativo**: Colores de marca de Renovables del Sur México
- 🗂️ **Sidebar Colapsable**: Historial de conversaciones y navegación
- ⚡ **App Router de Next.js**: Arquitectura moderna con Server Components
- 🎪 **Selector de Modelos**: Dropdown para elegir entre diferentes modelos de IA

## Paleta de Colores

### Modo Claro
- **Primario/Acento**: #0EB8C9 (Cian brillante)
- **Secundario/Destacado**: #FCC619 (Amarillo dorado)  
- **Terciario/Éxito**: #8CB633 (Verde natural)

### Modo Oscuro
- **Fondo Principal**: #111828
- Los colores de marca se usan para elementos interactivos con buen contraste

## Estructura del Proyecto

```
/app
  ├── page.tsx              # Página de login
  ├── chat/
  │   ├── layout.tsx        # Layout con sidebar y header
  │   └── page.tsx          # Interfaz principal del chat
  ├── globals.css           # Estilos globales y utilidades
  └── layout.tsx            # Layout raíz con ThemeProvider

/components
  ├── ui/
  │   ├── Button.tsx        # Componente de botón reutilizable
  │   ├── Input.tsx         # Input con etiqueta y validación
  │   └── ThemeToggle.tsx   # Interruptor de tema
  ├── chat/
  │   ├── Sidebar.tsx       # Barra lateral con historial
  │   ├── Header.tsx        # Header con selector de modelo
  │   ├── ChatMessage.tsx   # Componente de mensaje
  │   ├── ChatInput.tsx     # Input expandible con envío
  │   ├── TypingIndicator.tsx # Indicador de escritura
  │   └── EmptyState.tsx    # Estado inicial del chat
  └── providers/
      └── ThemeProvider.tsx # Provider de contexto de tema

/hooks
  └── useTheme.ts           # Hook personalizado para manejo de tema
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Uso

1. **Login**: La página raíz (/) muestra el formulario de login
2. **Chat**: Después del login, se redirige a /chat con la interfaz completa
3. **Sidebar**: Clic en el menú hamburguesa para mostrar/ocultar el historial
4. **Tema**: Usar el interruptor en la esquina superior derecha
5. **Modelos**: Seleccionar modelo de IA desde el dropdown en el header

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción  
- `npm run start` - Servidor de producción
- `npm run lint` - Linting con ESLint

## Tecnologías Utilizadas

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Hooks** para manejo de estado