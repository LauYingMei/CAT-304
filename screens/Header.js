import {View,  StyleSheet, Text} from 'react-native';

//Display header
const Header = ()  => { 
    return (
      <View style={styles.header}>
        <Text style={styles.header_text}>Cuti-cuti Agro</Text>    
      </View>
    );
};

//Style
const styles = StyleSheet.create({
    header: {
      paddingVertical: 10,
      flexDirection:'row',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    header_text:{
      marginTop: '5%',
      color: '#20b2aa',
      fontSize: 30,
      textShadowColor: 'black',
      fontWeight: 'bold',
    },
});

export default Header;