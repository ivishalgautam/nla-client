import React from "react";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import AbacusCertificateTemplate from "/abacus-olympiad-certificate.jpg";
import VedicCertificateTemplate from "/vedic-olympiad-certificate.jpg";

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
          {result?.subject === "abacus" ? (
            <Image
              style={{ width: "100%", height: "100%" }}
              {...AbacusCertificateTemplate}
            />
          ) : (
            <Image
              style={{ width: "100%", height: "100%" }}
              {...VedicCertificateTemplate}
            />
          )}
          {/* full name */}
          <Text
            style={{
              position: "absolute",
              top: "33%",
              left: "15%",
              fontWeight: "600",
              textTransform: "capitalize",
              transform: "translateX(-50%)",
            }}
          >
            {result?.fullname}
          </Text>

          {/* class */}
          <Text
            style={{
              position: "absolute",
              top: "39%",
              left: "15%",
              fontWeight: "600",
              textTransform: "capitalize",
              transform: "translateX(-50%)",
            }}
          >
            {result?.class}
          </Text>

          {/* school name */}
          <Text
            style={{
              position: "absolute",
              top: "45%",
              left: "25%",
              fontWeight: "600",
              textTransform: "capitalize",
              transform: "translateX(-50%)",
            }}
          >
            {result?.school_name}
          </Text>

          {/* grade */}
          <Text
            style={{
              position: "absolute",
              top: "51%",
              left: "25%",
              fontWeight: "600",
              textTransform: "capitalize",
              transform: "translateX(-50%)",
            }}
          >
            {result?.grade}
          </Text>

          {/* date */}
          <Text
            style={{
              position: "absolute",
              top: "63.5%",
              left: "21%",
              fontWeight: "600",
              textTransform: "capitalize",
              transform: "translateX(-50%)",
            }}
          >
            {new Date(result?.held_on).toDateString()}
          </Text>
        </View>

        {/* <Text style={styles.text}>{`Test name: ${result?.test_name}`}</Text>
        
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
