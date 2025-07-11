//This page is for designing the layout structure of our app
// This is not for designing the other components / pages 

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
     tabBar: {
    backgroundColor: '#ffffffff',
    borderTopWidth: 0,
    height: 60,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles