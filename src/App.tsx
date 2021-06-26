import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { RoomsList } from "./pages/RoomsList";
import { AdminRoom } from "./pages/AdminRoom";
import { JoinRoom } from "./pages/JoinRoom";

import "./services/firebase";

import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms" exact component={RoomsList} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/join" component={JoinRoom} />
          <Route path="/rooms/:id" component={Room} />
          
          <Route path="/admin/rooms/:id" component={AdminRoom} />
          
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
