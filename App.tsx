import React, {useEffect, useRef} from 'react';

import {View} from 'react-native';
import Canvas from 'react-native-canvas';
import {data, draw, filterData, normalizeData} from './src/logic';
function App(): JSX.Element {
  const sample = 30;

  const canvasRef = useRef<Canvas>(null);

  useEffect(() => {
    setInterval(() => {
      draw(canvasRef?.current, normalizeData(filterData(data, sample)));
    }, 200);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Canvas
        style={{width: '95%', height: '50%', backgroundColor: 'black'}}
        ref={canvasRef}
      />
    </View>
  );
}

export default App;
