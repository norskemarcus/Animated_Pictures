import { useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring, runOnJS} from 'react-native-reanimated'
// runOnJS = få fat på tråden som er javascript-tråden, kontra UI. Baggrundsopgaver skal vi tildele runONJS og ikke UI-tråden, så UI alltid er responsive

export default function App() {

  const [images, setImages] = useState([
    { id: 1, imgUrl: require('./assets/s1.jpg') },
    { id: 2, imgUrl: require('./assets/s2.jpg') },
    { id: 3, imgUrl: require('./assets/h.jpg') },
    { id: 4, imgUrl: require('./assets/hm.jpg') },
  ]);


  function swipeOff(cardId){
    setImages(prevImages => prevImages.filter(img => img.id !== cardId)) // får alle billeder udenom det billede som har det cardId man swiper til højre
  }

  return (
    <GestureHandlerRootView style={styles.rootView}>
       <View style={styles.container}>
        
            {
              images.map((image) => (
               <MyCard key={image.id} image={image} onSwipeOff={swipeOff}/>

              ))
            }
           
    </View>
    </GestureHandlerRootView>
   
  );
}

const MyCard = ({image, onSwipeOff}) => {

  const translateX = useSharedValue(0) // hooks som huske global state
  const rotate = useSharedValue(0)
  

  const onGestureEvent = useAnimatedGestureHandler ({ // funktion som returnerer en anden funktion
    onStart:(_, context) => { // _, ligeglad med navnet, vi skal have den anden
      context.translateX = translateX.value
     
    },
    onActive:(event, context) => { 
      translateX.value = context.translateX + event.translationX // sidste = det lille du har rykket, den i midten er der hvor du begynder at touche skærmen og den første er den globale værdi
      rotate.value = -translateX.value/25 // - er for at dreje i rigtig rætning
    },
    onEnd:() => { 
      if(Math.abs(translateX.value) > 100){
        translateX.value = withSpring(500) // rykker ud af vinduet til højre
        runOnJS(onSwipeOff)(image.id)
      } else {
        translateX.value = withSpring(0)
        rotate.value = withSpring(0)
      }
 
  
    }
  })


  // rotate etc. stilasering?
  const animateStyle = useAnimatedStyle(() => {
    return {
      transform: [ // transform key returneres fra useAnimatedStyle
        {translateX: translateX.value}, // lokal + global værdi
        {rotate: rotate.value + 'deg'}, // lytter til ændringer, deg = degress
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
