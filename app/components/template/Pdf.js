import React from "react";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import CertificateTemplate from "../../../public/certificate_template.png";

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    textTransform: "capitalize",
  },
  image: {
    marginVertical: 0,
    marginHorizontal: 0,
  },

  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
});

const Pdf = ({ result }) => {
  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={{
          padding: 0,
          margin: 0,
          position: "relative",
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            {...CertificateTemplate}
          />
          <Text
            style={{
              position: "absolute",
              top: "43%",
              left: "50%",
              textTransform: "capitalize",
              transform: "translateX(-50%)",
            }}
          >
            {result?.fullname}
          </Text>
          <Text
            style={{
              position: "absolute",
              top: "71%",
              left: "49.2%",
            }}
          >
            {result?.grade}
          </Text>
        </View>

        {/* <Text style={styles.text}>{`Test name: ${result?.test_name}`}</Text>
        <Text
          style={styles.text}
        >{`Total questions: ${result?.total_questions}`}</Text>
        <Text
          style={styles.text}
        >{`You attempted: ${result?.student_attempted}`}</Text>
        <Text
          style={styles.text}
        >{`Total points: ${result?.total_points}`}</Text>
        <Text
          style={styles.text}
        >{`Your points: ${result?.student_points}`}</Text> */}
      </Page>
    </Document>
  );
};

export default Pdf;
