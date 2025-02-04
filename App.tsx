import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { SwitchCamera } from "lucide-react-native";

export default function App() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [facing, setFacing] = useState("back");
    const [scannedData, setScannedData] = useState(""); // ✅ Estado para armazenar o QR Code lido

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted"); // ✅ Pega as permissões do celular de câmera
        };

        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        setScannedData(data); // ⚡ Atualiza o estado com o valor lido
    };

    const requestPermissionAgain = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
    };

    function handleFacing() {
        setFacing((current) => (current === "back" ? "front" : "back")); // ⚡ Atualiza o estado com o câmera frontal ou traseira.
    }

    return (
        <View style={styles.container}>
            {/* 📸 COMPONENTE DA CÂMERA */}
            {hasPermission === null ? (
                <Text style={styles.textMessage}>...</Text>
            ) : hasPermission === false ? (
                <View style={styles.permissionContainer}>
                    <Text style={styles.textMessage}>Permissão para usar a câmera foi negada.</Text>
                    <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={requestPermissionAgain}>
                        <Text style={styles.buttonText}>PERMITIR CÂMERA</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <CameraView
                    onBarcodeScanned={handleBarcodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"], // ⚡ Seleciona o tipo de leitura pra QRCODE
                    }}
                    facing={facing}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
            <View style={styles.bottomBar}>
                {/* BOTÃO DE INVERTER CÂMERA */}
                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleFacing}>
                    <SwitchCamera size={20} color={"white"} />
                    <Text style={styles.buttonText}>INVERTER</Text>
                </TouchableOpacity>

                {/* CAMPO DE MOSTRAR RESULTADO DA LEITURA */}
                <TextInput
                    style={styles.textInput}
                    value={scannedData}
                    editable={false} // 🚫 Impede o usuário de editar o input
                    placeholder="Aguardando leitura..."
                    placeholderTextColor={"white"}
                />
            </View>
        </View>
    );
}

{
    /* ✨ ESTILOS ✨ */
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    bottomBar: {
        flex: 1,
        width: "90%",
        alignSelf: "center",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 20,
        gap: 5,
    },
    button: {
        width: "100%",
        backgroundColor: "black",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 12,
    },
    textInput: {
        width: "100%",
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
        borderRadius: 5,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    textMessage: {
        color: "white",
        alignSelf: "center",
        fontSize: 100,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
