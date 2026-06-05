import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppInput } from "@/src/components/inputs/AppInput";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type PasswordInputProps = React.ComponentProps<typeof AppInput>;

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setVisible] = useState(false);

  return (
    <AppInput
      {...props}
      leftIcon="lock-closed-outline"
      secureTextEntry={!isVisible}
      inputStyle={styles.input}
      textContentType="password"
      right={
        <PasswordVisibilityButton
          isVisible={isVisible}
          onPress={() => setVisible((current) => !current)}
        />
      }
    />
  );
}

export function PasswordVisibilityButton({
  isVisible,
  onPress,
}: {
  isVisible: boolean;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.eye}>
      <Ionicons
        name={isVisible ? "eye-off-outline" : "eye-outline"}
        size={22}
        color={theme.colors.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eye: {
    padding: 2,
  },
  input: {
    paddingRight: 32,
  },
});
