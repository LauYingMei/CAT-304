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
      flexDirection:'row',
      justifyContent: 'center',
      backgroundColor: 'white',
      height: '13%',
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    header_text:{
      color: "#20b2aa",
      fontSize: 30,
      fontWeight: 'bold',
    },
});

export default Header;