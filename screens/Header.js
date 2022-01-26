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
      backgroundColor: '#10533f',
      height: '13%',
      alignItems: 'center',
    },
    header_text:{
      color: "#9cd548",
      fontSize: 30,
      fontWeight: 'bold',
    },
});

export default Header;