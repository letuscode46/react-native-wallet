import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SignOutButton } from "@/components/SignOutButton";
import PageLoader from "../../components/PageLoader";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import { NoTransactionsFound } from "../../components/NoTransactionsFound";
import { useTransactions } from "../../hooks/useTransactions";
import { styles } from "../../assets/styles/home.styles";

export default function Page() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const {
        transactions,
        summary,
        isLoading,
        error,
        loadData,
        deleteTransaction,
    } = useTransactions(user?.id, getToken);

    useEffect(() => {
        if (user?.id) {
            loadData();
        }
    }, [loadData, user?.id]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await loadData();
        } catch (err) {
            Alert.alert("Error", err.message || "Failed to refresh transactions");
        } finally {
            setRefreshing(false);
        }
    };

    const handleDelete = async (id) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteTransaction(id);
                            Alert.alert("Success", "Transaction deleted successfully");
                        } catch (error) {
                            Alert.alert("Error", error.message || "Failed to delete transaction");
                        }
                    },
                },
            ]
        );
    };

    if (isLoading && !refreshing) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadData}>
                    <Text style={styles.retryButton}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* HEADER */}
                <View style={styles.header}>
                    {/* LEFT */}
                    <View style={styles.headerLeft}>
                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Welcome,</Text>
                            <Text style={styles.usernameText}>
                                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Guest"}
                            </Text>
                        </View>
                    </View>
                    {/* RIGHT */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/create")}
                        >
                            <Ionicons name="add" size={20} color="#FFF" />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <SignOutButton />
                    </View>
                </View>

                {/* BALANCE */}
                <BalanceCard summary={summary} />

                {/* SECTION TITLE */}
                <View style={styles.transactionsHeaderContainer}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                </View>
            </View>

            {/* TRANSACTIONS LIST */}
            <FlatList
                style={styles.transactionsList}
                contentContainerStyle={styles.transactionsListContent}
                data={transactions}
                keyExtractor={(item, index) => item.id ? String(item.id) : `transaction-${index}`}
                renderItem={({ item }) => (
                    <TransactionItem item={item} onDelete={handleDelete} />
                )}
                ListEmptyComponent={<NoTransactionsFound />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}