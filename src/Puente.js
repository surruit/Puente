import ObjetoInteligente from "./ObjetoInteligente.js";
import Movil from "./Movil.js";
import Animator from "./Animator.js";
import Personaje from "./Personaje.js";
import PersonajeInput from "./PersonajeInput.js";
import InputSource from "./InputSource.js";
import InputSourceKeyBoard from "./InputSourceKeyBoard.js";
import InputSourceMouse from "./InputSourceMouse-html.js";
import InputSystem from "./InputSystem.js"
import KeyMap from "./KeyMap2.js";
import Menu from "./Menu.js";
import MenuManager from "./MenuManager.js";
import {GltfExtrasToListas, Loader} from "./Loader.js";
import LoaderManager from "./LoaderManager.js";
import LoadingScreen from "./LoadingScreen.js";
import Lista from "./Lista.js";

//creacion de variables globales
window.Puente = {};
window.Puente.ObjetoInteligente = ObjetoInteligente;
window.Puente.Movil = Movil;
window.Puente.Animator = Animator;
window.Puente.Personaje = Personaje;
window.Puente.PersonajeInput = PersonajeInput;
window.Puente.InputSource = InputSource;
window.Puente.InputSourceKeyBoard = InputSourceKeyBoard;
window.Puente.InputSourceMouse = InputSourceMouse;
window.Puente.InputSystem = InputSystem;
window.Puente.KeyMap = KeyMap;
window.Puente.Menu = Menu;
window.Puente.MenuManager = MenuManager;
window.Puente.Loader = {};
window.Puente.Loader.Loader = Loader;
window.Puente.Loader.GltfExtrasToListas = GltfExtrasToListas;
window.Puente.LoaderManager = LoaderManager;
window.Puente.LoadingScreen = LoadingScreen;
window.Puente.Lista = Lista;