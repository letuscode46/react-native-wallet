import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styles } from "@/assets/styles/auth.styles.js";
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded || loading) return;
        setLoading(true);
        setError('');

        try {
            const updatedSignUp = await signUp.create({
                emailAddress,
                password,
            });

            await updatedSignUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));

            if (err?.errors?.[0]?.code === "form_identifier_exists") {
                setError("Email taken. Try another.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded || loading) return;
        setLoading(true);
        setError('');

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Verify your email</Text>
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
                    style={[styles.verificationInput, error && styles.errorInput]}
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor="#9A8478"
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity style={styles.button} onPress={onVerifyPress} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} />
                <Text style={styles.title}>Create Account</Text>

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
                <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
                            <Text style={styles.linkText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
