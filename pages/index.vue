<template>
  <v-row justify="center" align="center">
    <v-snackbar color="red" v-model="snackbar" :timeout="timeout">
      {{ err }}
    </v-snackbar>
    <v-col cols="12" sm="8" md="6">
      <v-expand-transition v-if="wallet">
        <v-card
          class="mx-auto logo d-flex justify-center transition-fast-in-fast-out v-card--reveal"
          max-width="600"
        >
          <v-card-text>

            <!-- wallet header -->
            <v-card  color="#385F73" elevation="10" class="py-4 px-2 mb-2">
              <p class="text-h4 text--primary text-center">
                Balance:
                <span v-if="!balanceLoading">{{ wallet.balance }}</span>
                <span v-else
                  ><v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular
                ></span>
              </p>
            </v-card>

             <!-- Wallet add Transactions -->
            <v-form ref="walletForm" v-model="valid" lazy-validation>
              <p class="text-h5 white--text mt-4"><strong>Add New Transaction</strong></p>
              <v-text-field
                v-model="description"
                :rules="descriptionRules"
                :count="100"
                label="Description"
                required
                type="string"
              ></v-text-field>

              <v-text-field
                :rules="balanceRules"
                @input="handleInput($event, 'transactionAmount')"
                label="Amount"
                required
                type="string"
              ></v-text-field>

              <v-switch
                v-model="transitionType"
                :label="transitionType ? 'Debit' : 'Credit'"
              ></v-switch>

              <v-card-actions class="justify-center">
                <v-btn
                  rounded
                  color="success"
                  class="mr-4 mb-2"
                  @click="addBalance"
                >
                  Add
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-expand-transition>

      <!-- Setup wallet if not exist -->
      <v-card v-else class="mx-auto" max-width="600">
        <v-card-text>
          <p class="text-h4 text--primary">Setup the wallet</p>
          <div class="text--primary">
            There is no wallet assigned to you<br />
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            text
            outlined
            rounded
            color="teal accent-4"
            @click="reveal = true"
          >
            Setup wallet
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <v-card
            v-if="reveal"
            class="transition-fast-in-fast-out v-card--reveal"
            style="height: 100%"
          >
            <v-card-text class="pb-0">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="name"
                  :counter="20"
                  :rules="nameRules"
                  label="Name"
                  required
                ></v-text-field>

                <v-text-field
                  :value="balance"
                  @input="handleInput($event, 'balance')"
                  :rules="balanceRules"
                  label="Balances"
                  step="any"
                  type="string"
                ></v-text-field>

                <v-switch
                v-model="transitionType"
                :label="transitionType ? 'Debit' : 'Credit'"
              ></v-switch>

                <v-card-actions class="justify-center">
                  <v-btn
                    rounded
                    color="success"
                    class="mr-4 mb-2"
                    @click="addWallet"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-card>
    </v-col></v-row
  >
</template>

<script>
export default {
  data: () => ({
    wallet: null,
    reveal: false,
    valid: true,
    balanceLoading: false,
    balance: '',
    transactionAmount: '',
    name: "",
    description: "",
    snackbar: false,
    err: "",
    transitionType: 0,
    timeout: 2000,
    descriptionRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20 characters",
    ],
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20 characters",
    ],
    balanceRules: [
      (v) => /^\d*\.?\d*$/.test(v) || 'Only Positive numbers are allowed',
      (v) => Number(v) < 2147483647 && Number(v) > 0 || "Balance should be less than 2147483647 and greater than 0",
    ],
  }),
  created() {
    if (process.client) {
      if (localStorage.getItem("walletId")) {
        this.fetchWalletData();
      }
    }
  },
  methods: {
    handleInput(val, key) {
      if(val) {
        const indexOfDecimal = val.indexOf('.');
        if (indexOfDecimal !== -1 && val.length - indexOfDecimal > 5) {
          // Format the input value to have up to four decimal places
          this[key] = Number(val).toFixed(4);
        } else {
          this[key] = Number(val);
        }
      }
    },
    async fetchWalletData() {
      try {
        let walletId = localStorage.getItem("walletId");
        this.wallet = await this.$http.$get(`/api/v1/wallet/${walletId}`);
      } catch (err) {
        this.snackbar = true;
        this.err = err?.response?.data?.message || "Something went wrong";
      }
    },
    async addWallet() {
      try {
        const balance = this.transitionType ? -this.balance : this.balance;
        this.wallet = await this.$http.$post("/api/v1/wallet/setup", {
          name: this.name,
          balance: balance || 0,
        });
        this.transitionType = 0;
        localStorage.setItem("walletId", this.wallet.id);
      } catch (err) {
        this.snackbar = true;
        this.err = err?.response?.data?.message || "Something went wrong";
      }
    },
    async addBalance() {
      try {
        let walletId = localStorage.getItem("walletId");
        this.balanceLoading = true;
        this.wallet = await this.$http.$post(
          `/api/v1/transactions/${walletId}`,
          {
            description: this.description,
            amount: this.transitionType ? -this.transactionAmount : this.transactionAmount,
          }
        );
        this.$refs.walletForm.reset()
      } catch (err) {
        console.log(err, err.response);
        this.err = err?.response?.data?.message || "Something went wrong";
        this.snackbar = true;
      } finally {
        this.balanceLoading = false;
      }
    },
  },
};
</script>
