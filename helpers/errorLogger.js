import colors from "colors";

export const logError = (error, functionName) => {
  console.error(
    colors.bgRed.white(
      `Error in ${functionName} function\nERROR: ${error.stack || error}`
    )
  );
};

// \nLocation:  ${fileName}
