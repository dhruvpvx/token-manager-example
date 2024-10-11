import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

export const Button = (props: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
