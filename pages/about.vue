<!-- pages/about.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-6">About Us</h1>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
      <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Team of fitness professionals"
          class="w-full h-64 object-cover object-center"
      />

      <div class="p-6 md:p-8">
        <h2 class="text-2xl font-bold mb-4">Our Mission</h2>
        <p class="text-gray-700 mb-6">
          Welcome to Fitness & Wellness Blog, your trusted source for science-backed fitness advice, wellness tips, and sports news. Our mission is to empower individuals on their health journey with reliable information that inspires positive change and sustainable habits.
        </p>

        <h2 class="text-2xl font-bold mb-4">Our Story</h2>
        <p class="text-gray-700 mb-6">
          Founded in 2023 by a team of certified fitness professionals, nutritionists, and wellness enthusiasts, our blog was born from a shared passion for promoting health literacy and making quality fitness information accessible to everyone. We noticed a gap between scientific research and practical, actionable advice that people could implement in their daily lives.
        </p>

        <p class="text-gray-700 mb-6">
          What started as a small passion project has grown into a comprehensive resource hub with thousands of monthly readers. We take pride in cutting through the noise of fitness trends and fads to deliver content that stands the test of time and scientific scrutiny.
        </p>

        <h2 class="text-2xl font-bold mb-4">Our Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 class="font-semibold text-lg mb-2 text-primary-700">Evidence-Based Approach</h3>
            <p class="text-gray-600">
              We believe in the power of science. All our content is thoroughly researched and backed by peer-reviewed studies.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 class="font-semibold text-lg mb-2 text-primary-700">Inclusivity</h3>
            <p class="text-gray-600">
              Fitness is for everyone. We create content that addresses diverse needs, body types, and fitness levels.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 class="font-semibold text-lg mb-2 text-primary-700">Holistic Wellness</h3>
            <p class="text-gray-600">
              We recognize that true wellness encompasses physical, mental, and emotional health – they're all connected.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 class="font-semibold text-lg mb-2 text-primary-700">Practical Guidance</h3>
            <p class="text-gray-600">
              We focus on providing actionable advice that readers can implement immediately in their lives.
            </p>
          </div>
        </div>

        <h2 class="text-2xl font-bold mb-4">Meet Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="text-center">
            <div class="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
              <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
                  alt="Alex Johnson"
                  class="w-full h-full object-cover"
              />
            </div>
            <h3 class="font-semibold">Alex Johnson</h3>
            <p class="text-sm text-gray-600">Founder & Certified Trainer</p>
          </div>

          <div class="text-center">
            <div class="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
              <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
                  alt="Sarah Rodriguez"
                  class="w-full h-full object-cover"
              />
            </div>
            <h3 class="font-semibold">Sarah Rodriguez</h3>
            <p class="text-sm text-gray-600">Nutrition Specialist</p>
          </div>

          <div class="text-center">
            <div class="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
              <img
                  src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1634&q=80"
                  alt="Michael Kim"
                  class="w-full h-full object-cover"
              />
            </div>
            <h3 class="font-semibold">Michael Kim</h3>
            <p class="text-sm text-gray-600">Sports Medicine Expert</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold mb-4">Contact Us</h2>
        <p class="text-gray-700 mb-4">
          Have questions, feedback, or suggestions? We'd love to hear from you! Reach out to us at:
        </p>

        <div class="flex items-center space-x-2 text-gray-700 mb-2">
          <Mail class="h-5 w-5 text-primary-600" />
          <span>contact@fitnessandwellness.com</span>
        </div>

        <div class="flex items-center space-x-2 text-gray-700">
          <MapPin class="h-5 w-5 text-primary-600" />
          <span>123 Wellness Street, Fitness City, FC 98765</span>
        </div>
      </div>
    </div>

    <!-- Newsletter signup -->
    <div class="bg-primary-50 p-8 rounded-lg shadow-md mb-10">
      <h2 class="text-2xl font-bold mb-4 text-center">Join Our Newsletter</h2>
      <p class="text-gray-700 text-center mb-6">
        Stay updated with the latest fitness tips, wellness advice, and exclusive content delivered directly to your inbox.
      </p>

      <form @submit.prevent="subscribeToNewsletter" class="max-w-md mx-auto">
        <div class="flex flex-col sm:flex-row gap-4">
          <input
              type="email"
              v-model="newsletterEmail"
              placeholder="Your email address"
              class="flex-grow bg-white border border-gray-300 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
          />
          <button type="submit" class="btn btn-primary py-3">
            Subscribe
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-500 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Mail, MapPin } from 'lucide-vue-next';

const newsletterEmail = ref('');

// Newsletter subscription (placeholder function)
const subscribeToNewsletter = () => {
  alert(`Thank you for subscribing with ${newsletterEmail.value}! This is a demo implementation.`);
  newsletterEmail.value = '';
};
</script>