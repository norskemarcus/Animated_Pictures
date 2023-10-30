import { useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring} from 'react-native-reanimated'


export default function App() {

  const [images, setImages] = useState([
    { id: 1, imgUrl: require('./assets/s1.jpg') },
    { id: 2, imgUrl: require('./assets/s2.jpg') },
    { id: 3, imgUrl: require('./assets/h.jpg') },
    { id: 4, imgUrl: require('./assets/hm.jpg') },
  ]);



  return (
    <GestureHandlerRootView style={styles.rootView}>
       <View style={styles.container}>
        
            {
              images.map((image) => (
               <MyCard key={image} image={image}/>

              ))
            }
           
    </View>
    </GestureHandlerRootView>
   
  );
}

const MyCard = ({image}) => {


   
  const translateX = useSharedValue(0) // hooks som huske global state
  //const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)
  

  const onGestureEvent = useAnimatedGestureHandler ({ // funktion som returnerer en anden funktion
    onStart:(_, context) => { // ligeglad med navnet, vi skal have den anden?
      context.translateX = translateX.value
      rotate.value = -translateX.value/25
      //context.translateY = translateY.value
    },
    onActive:(event, context) => { 
      translateX.value = context.translateX + event.translationX // sidste = det lille du har rykket, den i midten er der hvor du begynder at touche skærmen og den første er den globale værdi
     // translateY.value = context.translateY + event.translationY
    },
    onEnd:() => { 
      translateX.value = withSpring(0)
     //translateY.value = withSpring(0)
    }
  })


  // rotate etc. stilasering?
  const animateStyle = useAnimatedStyle(() => {
    return {
      transform: [ // transform key returneres fra useAnimatedStyle
        {translateX: translateX.value}, // lokal + global værdi
        {translateY: translateY.value}, // lytter til ændringer
      ]
    }
  })


  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[animateStyle, styles.myStyle]}>
        <Image source={image.imgUrl} style={styles.imgStyle}></Image>
      </Animated.View>
  </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  imgStyle:{
    width: 200,
    height: 200
  },
  myStyle: {

  },
  rootView:{
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
