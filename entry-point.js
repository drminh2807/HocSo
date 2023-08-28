import Constants, { ExecutionEnvironment } from "expo-constants";

const isInExpoMode = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const entryPoint = isInExpoMode ? require("./App") : require("./index");

export default entryPoint