# LetMeAsk

Link da aplicação: [LetMeAsk](https://letmeask-rocketseat-nlw06.vercel.app/)

Este projeto foi desenvolvido durante a Next Level Week, evento da [Rocketseat](https://rocketseat.com.br/) que ocorreu entre os dias 20/06/2021 e 27/06/2021. Além do projeto inicial ensinado pela Rocket, decidi levar a aplicação para um próximo nível, me desafiando a implementar novas features que fariam sentido a usuários da plataforma. Neste README você irá encontrar as principais funcionalidades da aplicação, intruções para rodar o projeto e sugestões para colaboração externa, uma vez que o projeto é open source.

Este projeto foi inicializado utilizando o [Create React App](https://github.com/facebook/create-react-app).

# Sobre o Projeto

LetMeAsk é uma plataforma desenvolvida para melhorar a experiência de streamers que sofrem com um grande fluxo de perguntas do chat durante uma live. Sejam elas educativas ou de entretenimento, o fluxo de informação do chat público é muito intenso e, muitas vezes, difícil de acompanhar. Sendo assim, a plataforma apresenta perguntas de uma melhor forma, além de possuir um sistema de curtidas, em que o streamer pode se basear para priorizar as perguntas e comentários que serão abordados.

# Principais funcionalidades

### Funcionalidade nativas (guiadas pela Rocketseat)
- Autenticação com o Google utilizando firebase Auth
- Sistema de criação de salas
- Sistema de entrada em salas a partir de um identificador único
- Página de administração de página
- Envio, armazenamento e apresentação de perguntas dentro de uma sala
- Sistema de curtidas de perguntas

### Funcionalidade do próximo nível, idealizadas e implementadas por mim
- Melhorias de layout, responsividade e usabilidade
  - Utilização do [react-hot-toast](https://react-hot-toast.com/) para apresentação de notificações e erros
  - Bloqueio de usuários não permissionados em telas sensíveis (administração, por exemplo)
  - Melhor experiência para autenticação e controle de LogIn e LogOut em várias páginas
  - Redirecionamento automático caso um administrador entre em sua própria sala
- Autenticação com Github utilizando [Firebase Auth](https://firebase.google.com/products/auth)
- Apresentação de um perfil com estatísticas do usuário na plataforma
  - Criação de uma nova entidade no [realtime database](https://firebase.google.com/products/realtime-database) responsável por armazenar dados do usuário e as salas que o mesmo está vinculado (como administrador e como usuário)
  - Apresentação de dados analíticos: Número de salas administradas, perguntas respondidas, perguntas pendentes e salas conhecidas como usuário
  - Botões de ação aderentes à experiência: Listar salas (ver abaixo), criar um sala ou entrar em um sala
- Nova página com uma listagem de salas conhecidas
  - Apresentação das salas que o usuário administra e também as salas que o mesmo já entrou em algum momento
  - Interface diferenciada que ajuda a identificar as duas categorias: Adminisitrador ou usuário
  - Botão para navegação direta para a sala (de perguntas ou de administrador)
  - Botão de redirecionamento para o link da live cadastrada pelo dono da sala
  - Informações extras de acordo com o novo formulário de criação de sala
- Novas informações para criação de salas, utilizando [react-hook-form](https://react-hook-form.com/)
  - Input para descrição, data, hora e link para acessar live
  - Redirecionamento automático para página de administração
- Criação de uma entidade 'users' no banco de dados
  - Controle de salas visitadas
  - Armazenamento de dados fixos do usuário
  
# Layout da Aplicação

![home-login](https://i.ibb.co/g9g0KB5/home-login.png)

![home-stats](https://i.ibb.co/nwYXnxH/user-stats.png)

![list-rooms](https://i.ibb.co/g3L3QX2/list-rooms.png)

![new-room](https://i.ibb.co/jJPMKd7/new-room.png)

![join-room](https://i.ibb.co/ys0PMBk/join-room.png)

![room-qustions](https://i.ibb.co/YyStbwm/room-questions.png)

![admin-room](https://i.ibb.co/qNzFk7t/admin-room.png)

# Executando o projeto

### Configurando suas variáveis de ambiente
Após feito o clone do repositório, entre na pasta em que o mesmo se encontra e crie um arquivo `.env.local` na raiz do projeto, baseado no arquivo `.env.example` disponibilizado no repositório. Todas as variáveis de ambiente necessárias para a execução do projeto estão presente neste segundo arquivo.

O arquivo `.env.local` deve ser preenchido de acordo com as informações da instância do firebase. Para maiores detalhes de criação de um projeto no firebase, consulte a [documentação](https://firebase.google.com/docs/web/setup). Para aplicações pequenas (como é o caso desta), é gratuito e vale a experiência 😉

### Inicializando o projeto
Execute o comando `yarn start`

Após a compilação, a aplicação deve estar disponível em [http://localhost:3000](http://localhost:3000)

# Tecnologias utilizadas
- ReactJS (SPA configurado a partir do CRA)
- TypeScript
- Firebase Realtime Database
- Firebase Auth (Google e Github)
- Diversos
  - React-Hot-Toast
  - React Hooks & Custom Hooks
  - SASS

# Autor
Thiago Palermo Junqueira
