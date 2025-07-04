import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styles } from "@/assets/styles/auth.styles.js";
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignInScreen() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onSignInPress = async () => {
        if (!isLoaded || loading) return;
        setLoading(true);
        setError('');

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));

            if (err?.errors?.[0]?.code === "form_password_incorrect") {
                setError("Password is incorrect. Please try again.");
            } else if (err?.errors?.[0]?.code === "form_identifier_not_found") {
                setError("No account found with that email.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={styles.container}>
                <Image source={require("../../assets/images/revenue-i3.png")} style={styles.illustration} />
                <Text style={styles.title}>Welcome Back</Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError("")}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor="#948478"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#948478"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <TouchableOpacity style={styles.button} onPress={onSignInPress} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={styles.footerText}>Don&apos;t have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/sign-up')} disabled={loading}>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
