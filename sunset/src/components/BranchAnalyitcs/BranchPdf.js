import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  all: {
    fontSize:12,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

  },
  single: {
    width: '49%',
    border: '1px solid rgb(210, 210, 210)',
    padding: 10,
    marginBottom: 10,
  },
  number: {
    color: 'brown',
  },
  totalPrice: {
    fontWeight: 'bold',
  },
});
 
const MyDocument = ({data}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Fast 15 moving products</Text>
      </View>
      <View style={styles.all}>
        {data.map((performance, index) => (
          <View key={index} style={styles.single}>
            <Text style={styles.number}>{index + 1}</Text>
            <Text>{performance.product_name}</Text>
            <Text>{performance.total_count}  sold in the last 5 days @Kshs{performance.price}.</Text>
            <Text style={styles.totalPrice}>Total: {performance.total_amount}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const BranchPdf = ({data}) => (
  <div style={{ backgroundColor: '#021e46', display: 'inline-block',borderRadius:'5px',padding:'10px',color:'white'}}>
    <PDFDownloadLink document={<MyDocument data={data} />} fileName="products.pdf">
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'View fast moving products'
      }
    </PDFDownloadLink>
  </div>
);

export default BranchPdf;
