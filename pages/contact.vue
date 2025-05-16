<!-- pages/contact.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-6">Contact Us</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <!-- Contact form -->
      <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 class="text-2xl font-bold mb-4">Send Us a Message</h2>
        <p class="text-gray-600 mb-6">
          Have a question, suggestion, or just want to say hello? Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <div v-if="formSuccess" class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Your message has been sent! We'll get back to you soon.
        </div>

        <form @submit.prevent="submitContactForm" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
                id="name"
                v-model="contactForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
                id="email"
                v-model="contactForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
                id="subject"
                v-model="contactForm.subject"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
                id="message"
                v-model="contactForm.message"
                rows="5"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>

          <div class="flex items-center">
            <input
                id="newsletter"
                v-model="contactForm.newsletter"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="newsletter" class="ml-2 block text-sm text-gray-900">
              Subscribe to our newsletter
            </label>
          </div>

          <div>
            <button
                type="submit"
                class="w-full btn btn-primary py-2"
                :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Contact information -->
      <div>
        <div class="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h2 class="text-2xl font-bold mb-4">Get in Touch</h2>

          <div class="space-y-4">
            <div class="flex items-start">
              <Mail class="h-6 w-6 text-primary-600 mt-0.5 flex-shrink-0" />
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">Email</h3>
                <p class="mt-1 text-gray-600">contact@fitnessandwellness.com</p>
                <p class="mt-1 text-gray-600">support@fitnessandwellness.com</p>
              </div>
            </div>

            <div class="flex items-start">
              <Phone class="h-6 w-6 text-primary-600 mt-0.5 flex-shrink-0" />
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">Phone</h3>
                <p class="mt-1 text-gray-600">+1 (555) 123-4567</p>
                <p class="mt-1 text-gray-600">Mon-Fri, 9:00 AM - 5:00 PM</p>
              </div>
            </div>

            <div class="flex items-start">
              <MapPin class="h-6 w-6 text-primary-600 mt-0.5 flex-shrink-0" />
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">Address</h3>
                <p class="mt-1 text-gray-600">
                  123 Wellness Street<br>
                  Fitness City, FC 98765<br>
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-4">Follow Us</h2>
          <p class="text-gray-600 mb-4">
            Stay connected with us on social media for daily tips, motivation, and updates.
          </p>

          <div class="grid grid-cols-4 gap-4">
            <a
                href="#"
                class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Facebook class="h-6 w-6 text-blue-600" />
              <span class="mt-2 text-sm text-gray-700">Facebook</span>
            </a>

            <a
                href="#"
                class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Twitter class="h-6 w-6 text-blue-400" />
              <span class="mt-2 text-sm text-gray-700">Twitter</span>
            </a>

            <a
                href="#"
                class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Instagram class="h-6 w-6 text-pink-600" />
              <span class="mt-2 text-sm text-gray-700">Instagram</span>
            </a>

            <a
                href="#"
                class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Youtube class="h-6 w-6 text-red-600" />
              <span class="mt-2 text-sm text-gray-700">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ section -->
    <div class="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-10">
      <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div class="space-y-4">
        <div class="border border-gray-200 rounded-md overflow-hidden">
          <button
              @click="toggleFaq(1)"
              class="flex justify-between items-center w-full p-4 text-left focus:outline-none"
              :class="openFaq === 1 ? 'bg-primary-50' : 'bg-white'"
          >
            <span class="font-medium">How can I contribute to the blog?</span>
            <ChevronDown
                class="h-5 w-5 text-gray-500 transition-transform"
                :class="openFaq === 1 ? 'transform rotate-180' : ''"
            />
          </button>
          <div v-show="openFaq === 1" class="p-4 bg-white border-t border-gray-200">
            <p class="text-gray-600">
              We're always looking for expert contributors! Please send us a message with your area of expertise, writing samples, and proposed topic ideas. Our editorial team will review your application and get back to you within 5-7 business days.
            </p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-md overflow-hidden">
          <button
              @click="toggleFaq(2)"
              class="flex justify-between items-center w-full p-4 text-left focus:outline-none"
              :class="openFaq === 2 ? 'bg-primary-50' : 'bg-white'"
          >
            <span class="font-medium">Do you offer personalized fitness advice?</span>
            <ChevronDown
                class="h-5 w-5 text-gray-500 transition-transform"
                :class="openFaq === 2 ? 'transform rotate-180' : ''"
            />
          </button>
          <div v-show="openFaq === 2" class="p-4 bg-white border-t border-gray-200">
            <p class="text-gray-600">
              While our blog provides general fitness and wellness information, we don't currently offer personalized coaching through the website. However, several of our contributors are certified personal trainers and nutritionists who offer one-on-one services. Contact us for referrals.
            </p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-md overflow-hidden">
          <button
              @click="toggleFaq(3)"
              class="flex justify-between items-center w-full p-4 text-left focus:outline-none"
              :class="openFaq === 3 ? 'bg-primary-50' : 'bg-white'"
          >
            <span class="font-medium">Can I republish your content on my website?</span>
            <ChevronDown
                class="h-5 w-5 text-gray-500 transition-transform"
                :class="openFaq === 3 ? 'transform rotate-180' : ''"
            />
          </button>
          <div v-show="openFaq === 3" class="p-4 bg-white border-t border-gray-200">
            <p class="text-gray-600">
              All content on our blog is protected by copyright. We do not allow full republication of our articles. However, you may quote brief excerpts with proper attribution and a link back to the original article. For any commercial usage, please contact us for permission.
            </p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-md overflow-hidden">
          <button
              @click="toggleFaq(4)"
              class="flex justify-between items-center w-full p-4 text-left focus:outline-none"
              :class="openFaq === 4 ? 'bg-primary-50' : 'bg-white'"
          >
            <span class="font-medium">How often do you publish new content?</span>
            <ChevronDown
                class="h-5 w-5 text-gray-500 transition-transform"
                :class="openFaq === 4 ? 'transform rotate-180' : ''"
            />
          </button>
          <div v-show="openFaq === 4" class="p-4 bg-white border-t border-gray-200">
            <p class="text-gray-600">
              We publish new articles three times a week — on Monday, Wednesday, and Friday. Additionally, we send out a weekly newsletter every Sunday with a roundup of our latest content and exclusive tips. Subscribe to stay updated!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ChevronDown } from 'lucide-vue-next';

// Contact form
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  newsletter: false
});

const isSubmitting = ref(false);
const formSuccess = ref(false);

// FAQ toggle
const openFaq = ref(null);

const toggleFaq = (id) => {
  if (openFaq.value === id) {
    openFaq.value = null;
  } else {
    openFaq.value = id;
  }
};

// Form submission (placeholder function)
const submitContactForm = () => {
  isSubmitting.value = true;

  // Simulate API call
  setTimeout(() => {
    formSuccess.value = true;
    isSubmitting.value = false;

    // Reset form
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false
    };

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.value = false;
    }, 5000);
  }, 1500);
};
</script>