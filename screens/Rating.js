import React, {useState}  from 'react'
import {View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons/';

//Display ratings
const Rating = (rateNum)  => {
    const totalStars = 5;
    const [gainStars, setGainStars] = useState(rateNum);
    const [emptyStars] = useState(totalStars-gainStars);
    
    //Convert Rating
    if(gainStars > 0 && gainStars < 0.5){
      setGainStars(0);
    }
    else if(gainStars > 0.5 && gainStars < 1){
      setGainStars(0.5)
    }
    else if(gainStars > 1 && gainStars < 1.5){
      setGainStars(1)
    }
    else if(gainStars > 1.5 && gainStars < 2){
      setGainStars(1.5)
    }
    else if(gainStars > 2 && gainStars < 2.5){
      setGainStars(2)
    }
    else if(gainStars > 2.5 && gainStars < 3){
      setGainStars(2.5)
    }
    else if(gainStars > 3 && gainStars < 3.5){
      setGainStars(3)
    }
    else if(gainStars > 3.5 && gainStars < 4){
      setGainStars(3.5)
    }
    else if(gainStars > 4 && gainStars < 4.5){
      setGainStars(4)
    }
    else if(gainStars > 4.5 && gainStars < 5){
      setGainStars(4.5)
    }
    
    return (
      <View style={
        {
          flex: 1,
          flexDirection : "row",
          //justifyContent: 'center',
          //alignItems : "center",
          alignItems: 'flex-end'
        }
      }>

      {/* Display Full Stars */}
      {
          Array.from({length: gainStars}, (x, i) => {
          return(
              <MaterialIcons key={i} name="star" size={25} color="#FFA000"/>
          )
          })
      }

      {/* Display Half-Star */}
      {gainStars === 0.5 &&<MaterialIcons name="star-half" size={25} color="#FFA000" />}
      {gainStars === 1.5 &&<MaterialIcons name="star-half" size={25} color="#FFA000" />}
      {gainStars === 2.5 &&<MaterialIcons name="star-half" size={25} color="#FFA000" />}
      {gainStars === 3.5 &&<MaterialIcons name="star-half" size={25} color="#FFA000" />}
      {gainStars === 4.5 &&<MaterialIcons name="star-half" size={25} color="#FFA000" />}

      {/* Display Empty Stars */}
      {
        Array.from({length: totalStars-gainStars}, (x, i) => {

        return(
            <MaterialIcons key={i} name="star-border" size={25} color="#FFA000" />
        )
        })
      }

    </View>
  );
};

export default Rating;