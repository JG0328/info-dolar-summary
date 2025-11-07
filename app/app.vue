<template>
    <div class="bg-black min-h-screen text-white py-8">
        <!-- Container -->
        <div class="container mx-auto px-4 max-w-7xl">
            <div v-if="pending" class="text-center">
                <div class="text-xl">Loading...</div>
            </div>

            <div v-else-if="error" class="text-red-500">
                Error: {{ error.message }}
            </div>

            <div v-else-if="data?.success">
                <h1 class="text-4xl font-bold mb-8 text-center">Dollar Prices in Dominican Republic</h1>

                <!-- Average Section -->
                <div v-if="data.average" class="mb-12 p-8 bg-gray-900 rounded-xl border border-gray-700 shadow-lg">
                    <h2 class="text-3xl font-semibold mb-6 text-center">InfoDolar Average</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center">
                            <p class="text-gray-400 text-sm mb-2">Buy</p>
                            <p class="text-3xl font-bold text-green-400">{{ data.average.buyPrice }}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-400 text-sm mb-2">Sell</p>
                            <p class="text-3xl font-bold text-red-400">{{ data.average.sellPrice }}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-400 text-sm mb-2">Spread</p>
                            <p class="text-3xl font-bold">{{ data.average.spread }}</p>
                        </div>
                    </div>
                </div>

                <!-- Search Section -->
                <div class="mb-8">
                    <div class="relative max-w-xl mx-auto">
                        <input v-model="searchQuery" type="text" placeholder="Search entities by name..."
                            class="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-600 transition-all" />
                        <div v-if="searchQuery"
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                            @click="searchQuery = ''">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                    </div>
                    <p class="text-center text-gray-400 text-sm mt-3">
                        Showing {{ filteredEntities.length }} of {{ data.entities?.length || 0 }} entities
                    </p>
                </div>

                <!-- Entities Section -->
                <h2 class="text-3xl font-semibold mb-6">All Entities</h2>

                <!-- No results message -->
                <div v-if="filteredEntities.length === 0" class="text-center py-12">
                    <p class="text-gray-400 text-lg">No entities found matching "{{ searchQuery }}"</p>
                    <button @click="searchQuery = ''"
                        class="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                        Clear search
                    </button>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="item in filteredEntities" :key="item.entity"
                        class="p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-xl flex flex-col">
                        <!-- Image Section -->
                        <div class="flex justify-center mb-6">
                            <div v-if="item.imageUrl"
                                class="w-32 h-32 flex items-center justify-center bg-white rounded-lg p-3">
                                <img :src="item.imageUrl" :alt="item.imageAlt"
                                    class="max-w-full max-h-full object-contain" />
                            </div>
                            <div v-else class="w-32 h-32 flex items-center justify-center bg-gray-800 rounded-lg">
                                <span class="text-gray-600 text-sm">No image</span>
                            </div>
                        </div>

                        <!-- Entity Name -->
                        <h3 class="font-bold text-center mb-6 text-lg min-h-[3rem] flex items-center justify-center">
                            {{ item.entity }}
                        </h3>

                        <!-- Price Information -->
                        <div class="space-y-3 flex-1">
                            <div class="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                <span class="text-gray-400">Buy:</span>
                                <span class="text-green-400 font-bold text-lg">{{ item.buyPrice }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                <span class="text-gray-400">Sell:</span>
                                <span class="text-red-400 font-bold text-lg">{{ item.sellPrice }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                <span class="text-gray-400">Spread:</span>
                                <span class="font-bold text-lg">{{ item.spread }}</span>
                            </div>
                        </div>

                        <!-- Date (if available) -->
                        <div v-if="item.date"
                            class="text-gray-500 text-sm text-center mt-6 pt-4 border-t border-gray-800">
                            {{ new Date(item.date).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center text-gray-400">
                No data available
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ScraperResponse } from '@@/types/dollar';

const { data, error, pending } = await useFetch<ScraperResponse>('/api/scrape-dollar');

// Search query
const searchQuery = ref('')

// Sort and filter entities
const filteredEntities = computed(() => {
    if (!data.value?.entities) return []

    // First, sort alphabetically
    const sorted = [...data.value.entities].sort((a, b) => {
        return a.entity.localeCompare(b.entity)
    })

    // Then, filter by search query
    if (!searchQuery.value.trim()) {
        return sorted
    }

    const query = searchQuery.value.toLowerCase().trim()
    return sorted.filter(entity =>
        entity.entity.toLowerCase().includes(query)
    )
})
</script>
