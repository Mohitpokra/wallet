<template>
  <div>
    <div class="d-flex justify-space-between">
    <p class="text-h4 text--primary">Transactions</p>
     <v-btn
      class="ma-2"
      :loading="loadingCsv"
      :disabled="loadingCsv"
      color="success"
      @click="downloadCsv"
    >
      Download Csv
      <template v-slot:loader>
        <span>Loading...</span>
      </template>
    </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="transactions"
      :options.sync="options"
      :server-items-length="totaltransactions"
      :loading="loading"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>


<script>
import moment from "moment";

export default {
  data() {
    return {
      loading: false,
      loadingCsv: false,
      totaltransactions: 0,
      transactions: [],
      loading: true,
      options: {},
      headers: [
        {
          text: "Transaction ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Description", value: "description",  sortable: false },
        { text: "amount", value: "amount" },
        { text: "balance", value: "balance", sortable: false},
        { text: "date", value: "updatedAt" },
        { text: "type", value: "type", sortable: false},
        { text: "walletId", value: "walletId",  sortable: false }
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  methods: {
    async getDataFromApi() {
      this.loading = true;
      try {
        this.getTableData();
      } finally {
        this.loading = false;
      }
    },
   
    async getTableData() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let walletId = localStorage.getItem("walletId");
      if (walletId) {
        const { transactions, totalCount } = await this.$http.$get("/api/v1/transactions", {
          searchParams: {
            walletId,
            skip: itemsPerPage * (page - 1),
            limit: itemsPerPage,
            sortBy: sortBy[0] || '',
            isDesc: sortDesc[0] || false,
          },
        });
        this.transactions = transactions.filter((item) => {
          item.updatedAt = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
          return item;
        });
        this.totaltransactions = totalCount;
      } else {
        this.$router.push("/");
      }
    },

    async downloadCsv() {
       try {
         this.loadingCsv = true;
          let walletId = localStorage.getItem("walletId");
          if(walletId) {
            const { transactions } = await this.$http.$get("/api/v1/transactions", {
              searchParams: {
                walletId,
                sortBy: 'updatedAt',
                isDesc: false,
              },
            });
            this.$csvDownload(transactions);
          } else {
             this.$router.push("/");
          }
       } catch {
        console.log('******Done******', transactions);
       } finally {
         this.loadingCsv = false;
       }
    }
  },
};
</script>