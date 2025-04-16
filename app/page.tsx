"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import type React from "react"

// Define types for our data
interface VehicleData {
  id: number
  name: string
  description: string
  imageUrl: string
}

// Sample vehicle data
const vehicles: VehicleData[] = [
  {
    id: 1,
    name: "NISSAN FRONTIER",
    description:
      "Frontier cuenta con avanzadas asistencias a la conducción como asistentes de partida en subida (HSA), control dinámico vehicular (VDC) con sistema de antibloqueo (ABS), distribución electrónica de fuerza de frenado (EBD). Sorprendé a tus acompañantes con su capacidad de desarrollo dentro del segmento pickup de hasta donde la imaginación te permita.",
    imageUrl: "/images/nissan-frontier.png",
  },
  {
    id: 2,
    name: "NISSAN TITAN",
    description:
      "Es fácil sentir que te adueñas en una TITAN. Con capacidad para todo, esta camioneta combina la eficiencia de un motor de gran desempeño con la ingeniería japonesa de Zero Gravity integradas en los asientos delanteros. Además posee tecnología de alto rendimiento para que puedas transportarte con mayor confort.",
    imageUrl: "/images/nissan-titan.png",
  },
]

// Define types for filter buttons
interface FilterButton {
  id: number
  label: string
}

// Sample filter buttons
const filterButtons: FilterButton[] = [
  { id: 1, label: "Filtro 1" },
  { id: 2, label: "Filtro 2" },
  { id: 3, label: "Filtro 3" },
  { id: 4, label: "Filtro 4" },
  { id: 5, label: "Filtro 5" },
]

// Define types for filter categories
interface FilterCategory {
  id: string
  label: string
}

// Sample filter categories
const filterCategories: FilterCategory[] = [
  { id: "marca", label: "Marca" },
  { id: "modelo", label: "Modelo" },
  { id: "transmision", label: "Transmisión" },
  { id: "consumo", label: "Consumo" },
  { id: "color", label: "Color" },
  { id: "tarifa", label: "Tarifa" },
  { id: "disponible", label: "Disponible" },
]

// Define types for navigation buttons
interface NavButton {
  id: number
  label: string
}

// Sample navigation buttons
const navButtons: NavButton[] = [
  { id: 1, label: "Boton1" },
  { id: 2, label: "Boton2" },
  { id: 3, label: "Boton3" },
  { id: 4, label: "Boton4" },
]

// Sample search history
const sampleSearchHistory = [
  "Nissan Frontier 2023",
  "Toyota Hilux",
  "Ford Ranger",
  "Camionetas 4x4",
  "Vehículos familiares",
]

// Vehicle Card Component
const VehicleCard: React.FC<{ vehicle: VehicleData }> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-56 sm:h-64 md:h-72">
        <Image src={vehicle.imageUrl || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" priority />
      </div>
      <div className="p-5 md:p-7">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{vehicle.name}:</h2>
        <p className="text-base md:text-lg text-gray-700">{vehicle.description}</p>
      </div>
    </div>
  )
}

// Interface for selected filters
interface SelectedFilter {
  filterId: number
  categoryId: string
  categoryLabel: string
}

export default function Home(): React.ReactElement {
  // State for active filter dropdown
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  // State for selected filter categories
  const [selectedFilterCategories, setSelectedFilterCategories] = useState<SelectedFilter[]>([])
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // State for search input
  const [searchInput, setSearchInput] = useState("")
  // State for search history dropdown
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  // State for search history
  const [searchHistory, setSearchHistory] = useState(sampleSearchHistory)

  // Ref for search container
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Handle click outside search history dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchHistory(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Function to handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      // Add search to history if it's not already there
      if (!searchHistory.includes(searchInput)) {
        setSearchHistory([searchInput, ...searchHistory.slice(0, 4)])
      }
      // Here you would normally perform the actual search
      setSearchInput("")
      setShowSearchHistory(false)
    }
  }

  // Function to select a search history item
  const selectSearchHistoryItem = (item: string) => {
    setSearchInput(item)
    setShowSearchHistory(false)
    // Here you would normally perform the search with the selected item
  }

  // Function to toggle filter dropdown
  const toggleFilter = (filterId: string) => {
    if (activeFilter === filterId) {
      setActiveFilter(null)
    } else {
      setActiveFilter(filterId)
    }
  }

  // Function to select a filter category
  const selectFilterCategory = (filterId: number, categoryId: string, categoryLabel: string) => {
    // Check if this filter already has a category selected
    const existingFilterIndex = selectedFilterCategories.findIndex((filter) => filter.filterId === filterId)

    if (existingFilterIndex >= 0) {
      // Replace the existing filter category
      const newFilters = [...selectedFilterCategories]
      newFilters[existingFilterIndex] = { filterId, categoryId, categoryLabel }
      setSelectedFilterCategories(newFilters)
    } else {
      // Add new filter category
      setSelectedFilterCategories([...selectedFilterCategories, { filterId, categoryId, categoryLabel }])
    }

    // Close the dropdown
    setActiveFilter(null)
  }

  // Get available filter categories (excluding already selected ones)
  const getAvailableCategories = () => {
    const selectedCategoryIds = selectedFilterCategories.map((filter) => filter.categoryId)
    return filterCategories.filter((category) => !selectedCategoryIds.includes(category.id))
  }

  // Get the selected category for a filter button
  const getSelectedCategory = (filterId: number) => {
    return selectedFilterCategories.find((filter) => filter.filterId === filterId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="text-xl md:text-2xl font-bold text-[#f7941d]">REDIBO</div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-[#f7941d]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navButtons.map((button) => (
              <button key={button.id} className="text-gray-700 hover:text-[#f7941d]">
                {button.label}
              </button>
            ))}
          </nav>

          {/* Navigation - Mobile */}
          {mobileMenuOpen && (
            <nav className="w-full md:hidden mt-3 pb-2 border-b border-gray-200">
              <div className="flex flex-col space-y-2">
                {navButtons.map((button) => (
                  <button key={button.id} className="text-gray-700 hover:text-[#f7941d] py-1">
                    {button.label}
                  </button>
                ))}
              </div>
            </nav>
          )}

          {/* Auth buttons */}
          <div className={`flex items-center mt-3 md:mt-0 ${mobileMenuOpen ? "w-full" : "hidden md:flex"}`}>
            <Button className="flex-1 md:flex-none bg-[#f7941d] hover:bg-[#e68a1a] text-white rounded-r-none border-r border-[#e68a1a]">
              Registrarse
            </Button>
            <Button
              variant="outline"
              className="flex-1 md:flex-none border-[#f7941d] text-[#f7941d] hover:bg-[#fff8f0] rounded-l-none border-l-0"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-center">
          <div className="w-full md:w-auto flex items-center justify-center mb-3 md:mb-0 md:mr-4">
            <div ref={searchContainerRef} className="relative w-full max-w-md">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Buscar vehículos..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSearchHistory(true)}
                />
                <button
                  type="submit"
                  className="bg-[#f7941d] hover:bg-[#e68a1a] text-white px-3 py-2 rounded-r-md flex items-center justify-center transition-colors duration-200"
                  aria-label="Buscar"
                  title="Buscar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>

              {/* Search History Dropdown */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Búsquedas recientes</h3>
                    <ul className="space-y-1">
                      {searchHistory.map((item, index) => (
                        <li key={index}>
                          <button
                            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                            onClick={() => selectSearchHistoryItem(item)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-3 md:p-4 w-full md:w-auto">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 relative">
              {/* Filter buttons */}
              {filterButtons.map((filter) => {
                const selectedCategory = getSelectedCategory(filter.id)
                return (
                  <div key={filter.id} className="relative">
                    <button
                      onClick={() => toggleFilter(filter.id.toString())}
                      className={`py-1.5 md:py-2 px-2 md:px-3 text-sm md:text-base text-gray-700 hover:text-[#f7941d] border border-gray-300 rounded-md flex items-center ${
                        selectedCategory ? "bg-gray-100" : ""
                      }`}
                    >
                      {selectedCategory ? selectedCategory.categoryLabel : filter.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown for filter options */}
                    {activeFilter === filter.id.toString() && (
                      <div className="absolute z-10 mt-1 w-36 md:w-40 bg-white rounded-md shadow-lg p-1.5 md:p-2 border border-gray-200">
                        <div className="grid gap-1">
                          {getAvailableCategories().map((category) => (
                            <button
                              key={category.id}
                              onClick={() => selectFilterCategory(filter.id, category.id, category.label)}
                              className="text-left px-2 py-1 bg-[#f7941d] text-white hover:bg-[#e68a1a] rounded-md mb-1 text-xs md:text-sm"
                            >
                              {category.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              <Button className="bg-[#f7941d] hover:bg-[#e68a1a] text-white text-sm md:text-base py-1.5 md:py-2 h-auto">
                Filtrar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-6xl mx-auto">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </main>
    </div>
  )
}
