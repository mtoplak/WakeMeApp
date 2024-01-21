import { Redirect } from "expo-router";
import Database from "./database";

const StartPage = () => {
  Database.createTable();
  return <Redirect href="/home" />;
};

export default StartPage;
