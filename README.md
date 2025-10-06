# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# OpenMind-Tech-frontend

--- 

## Nome do Projeto:  OpenMind Tech

Uma plataforma gamificada de aprendizado em tecnologia onde usuários podem criar e participar de quizzes, exercícios e desafios na área de TI/Computação.

### Objetivo do projeto:

Desenvolver um app mobile voltado ao aprendizado de conteúdos na área da tecnologia da informação. O aplicativo terá interação com o usuário, de exercícios de forma gamificada. O App será desenvolvido com o uso de tecnologias: TypeScript, Expo, NextJS, Expo Router.

### Público Alvo: 

Profissionais da área da tecnologia da informação.

### Funcionalidades: 

O usuário pode criar quizzes, exercícios, charadas e tópicos relacionado a um campo específico da área da computação.

**integrantes:** Cleiton, Pedro Mesquita, Nycollas Machado e Vinicius Lima.

## Principais Funcionalidades

### **Home Page Moderna**
- Dashboard com pontuação pessoal e posição no ranking
- Estatísticas detalhadas (pontos, sequência, quizzes completados)
- Sistema de gamificação com níveis e badges
- Animações suaves e design moderno
- Ranking ao vivo dos top usuários

### **Criação de Conteúdo**
- **Quiz Interativo**: Criar quizzes de múltipla escolha
- **Exercícios Práticos**: Desafios de programação
- **Charadas Tech**: Enigmas e quebra-cabeças
- **Tópicos Educativos**: Artigos e explicações
- Interface intuitiva com cards coloridos e gradientes

### **Áreas de Estudo**
- Programação (Algoritmos, Estruturas de Dados)
- Desenvolvimento Web (HTML, CSS, JavaScript, React)
- Mobile (React Native, Flutter, Swift)
- Data Science (Python, R, Machine Learning)
- Cloud Computing (AWS, Azure, GCP)
- Cibersegurança (Ethical Hacking, Redes)

### **Sistema de Quiz**
- Interface interativa com feedback visual
- Explicações detalhadas para cada resposta
- Barra de progresso animada
- Sistema de pontuação
- Tela de resultados com percentual de acertos

## Tecnologias Utilizadas

### **Framework e Linguagens**
- **Expo** (~53.0.22) - Framework React Native
- **React Native** (0.79.6) - Desenvolvimento mobile
- **TypeScript** (~5.8.3) - Tipagem estática
- **React** (19.0.0) - Biblioteca de UI

### **Navegação e Roteamento**
- **Expo Router** (~5.1.5) - Roteamento baseado em arquivos
- **React Navigation** (v7) - Navegação nativa

### **UI/UX e Animações**
- **Expo Linear Gradient** - Gradientes modernos
- **Expo Vector Icons** - Ícones consistentes
- **React Native Reanimated** - Animações performáticas
- **React Native Gesture Handler** - Gestos nativos
- **Animated API** - Animações customizadas

### **Utilitários**
- **React Native Safe Area Context** - Área segura
- **React Native Mask Input** - Máscaras para inputs
- **Expo Haptics** - Feedback tátil

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting de código
- **TypeScript** - Tipagem e IntelliSense
- **Metro Bundler** - Bundler otimizado

## **Design System**

### **Cores Principais**
- Primária: `#667eea` (Azul gradiente)
- Secundária: `#764ba2` (Roxo gradiente)
- Accent: `#f093fb` (Rosa)
- Success: `#43e97b` (Verde)
- Warning: `#FFD700` (Dourado)

### **Componentes Reutilizáveis**
- Cards com gradientes e sombras
- Botões com feedback visual
- Inputs com ícones integrados
- Badges e indicadores de status
- Barras de progresso animadas

## 📱 **Plataformas Suportadas**
- **iOS** (nativo)
- **Android** (nativo)
- **Web** (via React Native Web)

## **Como Executar**

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Iniciar o projeto**
   ```bash
   npm start
   ```

3. **Executar em dispositivo**
   - **Android**: Pressione `a` no terminal
   - **iOS**: Pressione `i` no terminal  
   - **Web**: Pressione `w` no terminal
   - **Expo Go**: Escaneie o QR code

##  **Funcionalidades MVP**

### **Próximos Passos**
- [ ] Integração com backend/API
- [ ] Sistema de autenticação completo
- [ ] Banco de dados para quizzes e usuários
- [ ] Modo offline

## **Arquitetura do Projeto**

```
app/
├── (tabs)/           # Navegação principal
│   ├── index.tsx     # Home page
│   ├── explore.tsx   # Criação de conteúdo
│   └── _layout.tsx   # Layout das tabs
├── screens/          # Telas auxiliares
│   ├── LoginScreen.tsx
│   └── QuizScreen.tsx
└── images/           # Assets locais
```

## **Diferenciais Técnicos**

- **Performance**: Uso de `useNativeDriver` em todas as animações
- **UX**: Feedback visual imediato e animações contextuais
- **Acessibilidade**: Cores contrastantes e navegação intuitiva
- **Escalabilidade**: Arquitetura modular e componentizada
- **Responsividade**: Layout adaptável a diferentes tamanhos de tela

## **Métricas de Gamificação**

- **Pontos**: Sistema de recompensa por atividades
- **Ranking**: Classificação global dos usuários
- **Sequência**: Dias consecutivos de atividade
- **Badges**: Conquistas por categorias
- **Níveis**: Progressão baseada em pontuação

---

**Desenvolvido com React Native + Expo**


