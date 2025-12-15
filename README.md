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

## OpenMind Tech - Frontend

### Objetivo do Projeto

Desenvolver um aplicativo mobile voltado ao aprendizado de conteúdos na área de tecnologia da informação. O app oferece interação gamificada com exercícios, quizzes e um feed social para compartilhamento de conhecimento entre profissionais de TI.

### Público-Alvo

Profissionais e estudantes da área de tecnologia da informação que buscam aprimorar seus conhecimentos de forma interativa e colaborativa.

---

## Funcionalidades Implementadas

### Autenticação
- **Cadastro de usuários** com validação de dados
- **Login seguro** com JWT
- **Proteção de rotas** - acesso apenas para usuários autenticados

### Feed Social
- **Visualização de publicações** de outros usuários
- **Sistema de likes** com atualização em tempo real
  - Contador de curtidas
  - Indicador visual quando o usuário curtiu
  - Prevenção de múltiplos cliques
- **Criação de posts** com:
  - Título e conteúdo
  - Upload de imagens
  - Tags categorizadas
- **Edição e exclusão** de publicações próprias
- **Sistema de paginação** e refresh
- **Indicador de progresso** com níveis gamificados

### Interface do Usuário
- Design moderno e responsivo
- Componentes reutilizáveis e temáticos
- Feedback visual com mensagens flash
- Animações e transições suaves
- Suporte a modo claro/escuro
- Navegação por abas intuitiva

### Recursos Técnicos
- **Upload de imagens** com preview
- **Máscaras de input** para CPF e telefone
- **Validação de formulários** em tempo real
- **Gerenciamento de estado** otimizado
- **Cache de dados** com AsyncStorage

---

## Tecnologias Utilizadas

- **TypeScript** - Tipagem estática e segurança de código
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento e build
- **Expo Router** - Navegação file-based
- **AsyncStorage** - Persistência local de dados
- **React Navigation** - Navegação avançada

### Principais Dependências

```json
{
  "expo": "~53.0.22",
  "react": "19.0.0",
  "react-native": "0.79.6",
  "expo-router": "~5.1.5",
  "expo-image": "~2.4.0",
  "react-native-gesture-handler": "~2.24.0",
  "react-native-reanimated": "~3.17.4",
  "react-native-mask-input": "^1.2.3"
}
```

---

## Estrutura do Projeto

```
app/
├── (tabs)/              # Navegação principal
│   ├── index.tsx        # Feed/Home
│   ├── explore.tsx      # Explorar
│   └── create-post.tsx  # Criar publicação
├── screens/             # Telas standalone
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── homeScreen.tsx
├── images/             # Assets de imagens
└── _layout.tsx         # Layout raiz

components/             # Componentes reutilizáveis
├── ui/                # Componentes de UI base
└── ThemedText.tsx     # Componentes temáticos

constants/             # Constantes e configurações
└── Colors.ts          # Paleta de cores

hooks/                 # Custom hooks
└── useThemeColor.ts   # Hook de tema
```

---

## Funcionalidades

- [ ] Login
- [ ] Criação de usuário
- [ ] Criação de publicação
- [ ] Excluir publicação
- [ ] Editar publicação
- [ ] Selecionar imagem para publicação
- [ ] Curtir publicação
- [ ] Comentar em publicação
- [ ] Usuário pode selecionar sua profissão

---

## Equipe

**Integrantes:** Cleiton Aparecido, Pedro Mesquita, Nycollas Machado e Vinicius Lima

---
