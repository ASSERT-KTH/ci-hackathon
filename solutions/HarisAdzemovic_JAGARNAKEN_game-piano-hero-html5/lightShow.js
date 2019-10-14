GREEN_LIGHTS = [0, 255, 0];
RED_LIGHTS = [255, 0, 0];

// LIGHTSHOW_URL = "http://localhost:8000";
LIGHTSHOW_URL = "http://192.168.0.157:8000";
LIGHTSHOW_SESSION = "harex";

const setObject = (number, color) => {
  return {
    id: number.toString(),
    color: color
  };
};

const setAllGreen = () => {
  const setArray = [];
  let i;
  for (i = 1; i < 25; i++) {
    setArray.push(setObject(i, GREEN_LIGHTS));
  }
  return setArray;
};

const setAllRed = () => {
  const setArray = [];
  let i;
  for (i = 1; i < 25; i++) {
    setArray.push(setObject(i, RED_LIGHTS));
  }
  return setArray;
};

const sendColorCommand = colorsToSet => {
  const postData = {
    session: LIGHTSHOW_SESSION,
    set: colorsToSet
  };

  fetch(`${LIGHTSHOW_URL}/setbulk`, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(postData)
  });
};
