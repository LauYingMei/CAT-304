import React, {useState}  from 'react'
import {View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons/';

//Display ratings
const Rating = (rateNum)  => {
    const totalStars = 5;
    const gainStars = rateNum;
    const [emptyStars] = useState(totalStars-gainStars);
  
    return (
      <View style={
          {
            flex: 1,
            flexDirection : "row",
            justifyContent: 'center',
            alignItems : "center",
            padding: 8,
          }
        }>
        
        {/* Display Full Stars */}
        {
            Array.from({length: gainStars}, (x, i) => {
            return(
                <MaterialIcons key={i} name="star" size={30} color="#FFA000"/>
            )
            })
        }

        {/* Display Half-Star */}
        {emptyStars === 0.5 &&<MaterialIcons name="star-half" size={30} color="#FFA000" />}
        {emptyStars === 1.5 &&<MaterialIcons name="star-half" size={30} color="#FFA000" />}
        {emptyStars === 2.5 &&<MaterialIcons name="star-half" size={30} color="#FFA000" />}
        {emptyStars === 3.5 &&<MaterialIcons name="star-half" size={30} color="#FFA000" />}
        {emptyStars === 4.5 &&<MaterialIcons name="star-half" size={30} color="#FFA000" />}

        {/* Display Empty Stars */}
        {
          Array.from({length: totalStars-gainStars}, (x, i) => {

          return(
              <MaterialIcons key={i} name="star-border" size={30} color="#FFA000" />
          )
          })
        }

      </View>
    );
};

export default Rating;