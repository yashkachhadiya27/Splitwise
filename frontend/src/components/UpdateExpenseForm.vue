<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-icon v-bind="activatorProps" @click="prefillExpense()"
        >mdi-pencil</v-icon
      >
      <v-icon @click="sendMail(expense)">mdi-email</v-icon>
    </template>
    <v-card>
      <v-card-title>Update Expense</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="expense_name"
            label="Expense Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="total_amount"
            label="Expense Amount"
            required
          ></v-text-field>
          <v-textarea
            v-model="expense_description"
            label="Expense Description"
            required
          ></v-textarea>
          <v-file-input
            v-model="bill_receipt"
            label="Bill Receipt"
            accept="image/*"
            required
          ></v-file-input>

          
          <!-- <v-file-input
            label="Bill Receipt"
            accept="image/*"
            required
            @change="handleImageChange"
          ></v-file-input> -->

          <v-select
            v-model="payer_id"
            :items="final_participants"
            label="Payer Name"
            required
            @click="searchParticipants"
          ></v-select>

          <v-select
            v-model="selectedParticipants"
            :items="final_participants"
            label="Select Participants"
            multiple
            @click="searchParticipants"
          ></v-select>

          <v-select
            v-model="split_type"
            :items="splitTypes"
            label="Split Type"
            required
          >
          </v-select>

          <!-- Display selected participants if split type is "Percentage" -->
          <v-row v-if="split_type === 'Percentage'">
            <v-col cols="12">
              <h3>Selected Participants</h3>
              <v-row
                v-for="(participantId, index) in selectedParticipants"
                :key="index"
              >
                <v-col cols="4">
                  <span>{{ getParticipantName(participantId) }}</span>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="selectedParticipantsWithPercent[participantId]"
                    label="Percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="editExpense">Save</v-btn>
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "../../node_modules/vue3-toastify/dist/index.css";

export default {
  name: "UpdateExpenseForm",
  props: ["windowWidth", "expense_id"],
  data() {
    return {
      dialog: false,
      selectedParticipants: [],
      participants: [],
      splitTypes: ["Equal", "Percentage"],
      participant_percentage: [],
      selectedParticipantsWithAmount: [],
      selectedParticipantsWithPercent: [],
      expense: [],
      expense_name: "",
      total_amount: "",
      payer_id: null,
      split_type: "",
      bill_receipt: null,
      expense_description: "",
      group_id: null,
      totalAmountofParticipants: null,
    };
  },
  watch: {
    participant_percentages: {
      handler(newVal) {
        // Do something when participant percentages change
      },
      deep: true, 
    },
    expense(newValue, oldValue) {
      this.expense_name = newValue[0].expense_name;
      this.total_amount = newValue[0].total_amount;
      this.expense_description = newValue[0].expense_description;
      this.bill_receipt = newValue[0].bill_receipt;
      this.split_type = newValue[0].split_type;
      console.log("The expense changed from", oldValue, "to", newValue);
      console.log("new image", newValue[0].bill_receipt)

      this.selectedParticipants = [
        ...newValue.map((item) => item.id),
      ];
      this.payer_id = newValue[0].payer_id;
      // this.selectedParticipantsWithPercent = newValue.map(
      //   (item) => item.amount
      // );
    },
    selectedParticipantsWithPercent: {
    deep: true,
    handler(newValue) {
      for (const participantId in newValue) {
        newValue[participantId] = parseInt(newValue[participantId]);
      }
    }
  }
  },
  created() {
    const id = parseInt(this.$route.params.id);
    this.group_id = id;

    // Listen for window resize event
    window.addEventListener("resize", this.handleWindowResize);
  },
  destroyed() {
    // Remove event listener on before destroy
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    async editExpense() {
      // amount: this.expenseAmount / this.selectedParticipants.length,
      if (this.$refs.form.validate()) {
        if (this.split_type == "Equal") {
          console.log("amount  hi");
          this.selectedParticipantsWithAmount = this.selectedParticipants.map(
            (id) => {
              console.log("amount ", id);
              return {
                user_id: id,
                amount:
                  this.total_amount / (this.selectedParticipants.length),
              };
            }
          );
        } else if (this.split_type == "Percentage") {
          console.log("percentage");
          console.log("percentage----", this.selectedParticipantsWithPercent)
          
          let totalPercentage = 0;

          for (const key in this.selectedParticipantsWithPercent) {
            if (key !== '0') {
              totalPercentage += this.selectedParticipantsWithPercent[key];
            }
          }
          console.log("totalPercentage", totalPercentage)
          if (totalPercentage != 100) {
            toast.error("Total percentage must be 100.");
            return;
          }
          // this.selectedParticipantsWithAmount = this.selectedParticipants.map(
          //   (id, index) => ({
          //     user_id: id,
          //     amount:
          //       (parseFloat(this.total_amount) *
          //         parseFloat(this.participant_percentage[index])) /
          //       100,
          //   })
          // );
          for (const [participantId, percentage] of Object.entries(this.selectedParticipantsWithPercent)) {
            const amount = (this.total_amount * percentage) / 100;
            this.selectedParticipantsWithAmount[participantId] = amount;
          }

        }
        console.log(
          "participant with amount ",
          this.selectedParticipantsWithAmount
        );
        // Form is valid, proceed to submit
        const formData = new FormData();
        formData.append("expense_name", this.expense_name);
        formData.append("expense_amount", this.total_amount);
        formData.append("expense_description", this.expense_description);
        formData.append("ExpenseImage", this.bill_receipt);
        formData.append("payer_id", this.payer_id);
        // formData.append('participants', JSON.stringify(this.selectedParticipants));
        formData.append("split_type", this.split_type);
        formData.append("group_id", this.group_id);
        formData.append(
          "recipients",
          JSON.stringify(this.selectedParticipantsWithAmount)
        );
        formData.append("expense_id", this.expense_id);

        const participants = [];

        console.log("selected participants ", this.selectedParticipants);

        // Send an HTTP request to your backend to save the group details
        // Example using axios:
        console.log("image:",typeof(this.bill_receipt))
        await axios
          .put("http://localhost:3000/api/expenses/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            // Group created successfully
            this.$emit("expenseCreated", response.data);
            this.closeDialog();
            this.$emit("successToast");
            // Reset the form
            this.expense_name = "";
            this.total_amount = "";
            this.expense_description = "";
            this.bill_receipt = null;
            this.payer_id = null;
            this.selectedParticipants = [];
            this.selectedParticipantsWithAmount = [];
            this.split_type = null;
            this.group_id = null;
            this.participants = [];
            // this.expense_id = null;
          })
          .catch((error) => {
            console.error("Error creating expense:", error);
          });
      }
    },

  //   handleImageChange(event) {
  //   this.bill_receipt = event.target.files[0];
  // },

    async prefillExpense() {
      // await this.searchParticipants();
      await axios
        .get(
          `http://localhost:3000/api/expenses/prefillExpenses/${this.expense_id}`
        )
        .then((response) => {
          this.expense = response.data.Expense;
          console.log("expense info ",this.expense);
        })
        .catch((error) => {
          console.log(error);
        });
        await this.searchParticipants();
      this.edited_percentage();
    },

    async searchParticipants() {
      {
        const id = parseInt(this.$route.params.id);
        this.group_Id = id;

        await axios
          .get(`http://localhost:3000/api/groups/groupMembers/${id}`)
          .then((response) => {
            this.participants = response.data.members;

            this.final_participants = this.participants.map((data) => ({
              title: data.username,
              value: data.id,
            }));
            this.selectedParticipants = this.expense.map(item => (item.debtor_id))

            

            this.totalAmountofParticipants = this.expense.reduce((total, item) => total + item.amount, 0);
            console.log("totalAmountofParticipants", this.totalAmountofParticipants)

            if (this.totalAmountofParticipants < this.total_amount) {
                this.selectedParticipants.push(this.expense[0].payer_id);
            }

            console.log("selected participant are", this.selectedParticipants)

            // this.participants = response.data.members[1].name;
            console.log(this.participants);
            console.log("Participants: " + JSON.stringify(this.participants));
          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
          });
      }
    },

    edited_percentage() {
      this.expense.forEach((row) => {
        const { debtor_id, amount } = row;

        this.selectedParticipantsWithPercent[debtor_id] =
          (100 * amount) / this.total_amount;
      });
      this.selectedParticipantsWithPercent[this.payer_id] =
          (100 * (this.total_amount - this.totalAmountofParticipants)) / this.total_amount;
      console.log("percentage are:", this.selectedParticipantsWithPercent);
      // Add the payer to the percentage array
    },

    closeDialog() {
      this.dialog = false;
    },
    getParticipantName(participantId) {
      const participant = this.final_participants.find(
        (participant) => participant.value === participantId
      );
      return participant ? participant.title : "Unknown";
    },
  },
  //   watch: {
  //     expense(newValue, oldValue) {
  //       this.expense_name = newValue[0].expense_name;
  //       this.total_amount = newValue[0].total_amount;
  //       this.expense_description = newValue[0].expense_description;
  //       //this.payer_id = newValue[0].payer_username
  //       this.bill_receipt = newValue[0].bill_receipt;
  //       this.split_type = newValue[0].split_type;
  //       // this.split_type = "Percentage"
  //       console.log("The expense changed from", oldValue, "to", newValue);

  //       this.selectedParticipants = newValue.map((item) => item.id);
  //       this.payer_id = newValue[0].payer_id;
  //       this.selectedParticipantsWithPercent = newValue.map(
  //         (item) => item.amount
  //       );
  //     },
  //   },
  computed: {
    final_participants() {
      return this.participants.map((data) => ({
        title: data.username,
        value: data.id,
      }));
    },
  },
};
</script>

<style scoped>
.add-expense-btn {
  margin-right: 2px; /* Adjust margin as needed */
  margin-left: 10px;
}

.profile-avatar {
  margin-right: 10px; /* Adjust margin as needed */
  margin-left: 16px;
  border: 3px solid #673ab7;
}
</style>
