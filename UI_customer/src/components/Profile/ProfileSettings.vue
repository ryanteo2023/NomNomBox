<template>
  <div class="profile-container">
    <h2 class="profile-container__header">Profile Settings</h2>
    <form @submit.prevent="updateProfile">
      <div class="profile-container__form-group">
        <label class="profile-container__label">Email:</label>
        <input type="email" v-model="user.email" class="profile-container__input" readonly />
      </div>

      <div class="profile-container__form-group">
        <label class="profile-container__label">Display Name:</label>
        <input type="text" v-model="user.displayName" class="profile-container__input" required />
      </div>

      <div class="profile-container__form-group">
        <label class="profile-container__label">Dietary Preferences (You may select multiple):</label>
        <div class="profile-container__dietary-preferences">
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="alcohol-free" v-model="user.dietaryPreferences" /> &nbsp; Alcohol-Free
          </label>
          <!-- <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="alcohol-cocktail" v-model="user.dietaryPreferences" /> Alcohol-Cocktail
          </label> -->
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="celery-free" v-model="user.dietaryPreferences" /> &nbsp; Celery-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="crustacean-free" v-model="user.dietaryPreferences" /> &nbsp; Crustacean-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="dairy-free" v-model="user.dietaryPreferences" /> &nbsp; Dairy-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="dash" v-model="user.dietaryPreferences" /> &nbsp; DASH
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="egg-free" v-model="user.dietaryPreferences" /> &nbsp; Egg-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="fish-free" v-model="user.dietaryPreferences" /> &nbsp; Fish-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="fodmap-free" v-model="user.dietaryPreferences" /> &nbsp; FODMAP-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="immuno-supportive" v-model="user.dietaryPreferences" /> &nbsp; Immuno-Supportive
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="keto-friendly" v-model="user.dietaryPreferences" /> &nbsp; Keto-Friendly
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="kidney-friendly" v-model="user.dietaryPreferences" /> &nbsp; Kidney-Friendly
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="kosher" v-model="user.dietaryPreferences" /> &nbsp; Kosher
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="low-potassium" v-model="user.dietaryPreferences" /> &nbsp; Low Potassium
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="low-sugar" v-model="user.dietaryPreferences" /> &nbsp; Low Sugar
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="lupine-free" v-model="user.dietaryPreferences" /> &nbsp; Lupine-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="mediterranean" v-model="user.dietaryPreferences" /> &nbsp; Mediterranean
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="mollusk-free" v-model="user.dietaryPreferences" /> &nbsp; Mollusk-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="mustard-free" v-model="user.dietaryPreferences" /> &nbsp; Mustard-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="no-oil-added" v-model="user.dietaryPreferences" /> &nbsp; No oil added
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="paleo" v-model="user.dietaryPreferences" /> &nbsp; Paleo
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="peanut-free" v-model="user.dietaryPreferences" /> &nbsp; Peanut-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="pescatarian" v-model="user.dietaryPreferences" /> &nbsp; Pescatarian
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="pork-free" v-model="user.dietaryPreferences" /> &nbsp; Pork-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="red-meat-free" v-model="user.dietaryPreferences" /> &nbsp; Red-Meat-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="sesame-free" v-model="user.dietaryPreferences" /> &nbsp; Sesame-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="shellfish-free" v-model="user.dietaryPreferences" /> &nbsp; Shellfish-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="soy-free" v-model="user.dietaryPreferences" /> &nbsp; Soy-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="sugar-conscious" v-model="user.dietaryPreferences" /> &nbsp; Sugar-Conscious
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="sulfite-free" v-model="user.dietaryPreferences" /> &nbsp; Sulfite-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="tree-nut-free" v-model="user.dietaryPreferences" /> &nbsp; Tree-Nut-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="wheat-free" v-model="user.dietaryPreferences" /> &nbsp; Wheat-Free
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="vegetarian" v-model="user.dietaryPreferences" /> &nbsp; Vegetarian
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="vegan" v-model="user.dietaryPreferences" /> &nbsp; Vegan
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="gluten-free" v-model="user.dietaryPreferences" /> &nbsp; Gluten-Free
          </label>
          <!-- <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="balanced" v-model="user.dietaryPreferences" /> Balanced
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="high-fiber" v-model="user.dietaryPreferences" /> &nbsp; High-Fiber
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="high-protein" v-model="user.dietaryPreferences" /> &nbsp; High-Protein
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="low-carb" v-model="user.dietaryPreferences" /> &nbsp; Low-Carb
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="low-fat" v-model="user.dietaryPreferences" /> &nbsp; Low-Fat
          </label>
          <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="low-sodium" v-model="user.dietaryPreferences" /> Low-Sodium
          </label> -->
          <!-- <label class="profile-container__checkbox-inline">
            <input type="checkbox" value="none" v-model="user.dietaryPreferences" /> None
          </label> -->
        </div>
      </div>

      <button type="submit" class="profile-container__button">Update Profile</button>

      <div v-if="message" class="profile-container__alert alert-success mt-3">{{ message }}</div>
      <div v-if="error" class="profile-container__alert alert-danger mt-3">{{ error }}</div>
    </form>
  </div>
</template>



<script>
import { db } from '../../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';


export default {
  data() {
    return {
      user: {
        email: '',
        displayName: '',
        dietaryPreferences: [],
        notifications: false,
      },
      notificationSettings: {
        daysBeforeExpiry: 3,
      },
      message: '',
      error: '',
    };
  },
  async created() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user.email = user.email;
      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        this.user = { ...this.user, ...userDoc.data() };
      } else {
        console.error('No such document!');
      }
    } else {
      console.error('No user logged in');
      this.$router.push('/login');  // Redirect to login if no user
    }
  },
  methods: {
    async updateProfile() {
      this.message = '';
      this.error = '';
      const user = JSON.parse(localStorage.getItem('user'));

      try {
        // Prepare the data to update
        const updateData = {
          displayName: this.user.displayName,
          dietaryPreferences: this.user.dietaryPreferences,
          notifications: this.user.notifications,
        };

        await updateDoc(doc(db, 'users', user.uid), updateData);
        this.message = 'Profile updated successfully!';
      } catch (error) {
        this.error = 'Error updating profile: ' + error.message;
      }
    },
 
  },
};
</script>
