import SnowMain from "./snow/";
import hatMain from "./hat/";
import share from "./share";
import "../scss/index.scss";

if (process.env.NODE_ENV == "dev") {
	require("html-loader!../index.html");
}