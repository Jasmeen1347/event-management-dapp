import React from "react";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEvent from "./components/AddEvent";
import EventList from "./components/EventList";
import MyEvent from "./components/MyEvenet";
import NavBar from "./components/NavBar";
import NoPage from "./components/NoPage";
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<EventList />} />
            {/* <Route exact path='/addevent' element={<RequireAuth/>}>
            </Route> */}
              <Route path="/addevent" element={<AddEvent />} />
              <Route path="/myevent" element={<MyEvent />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
