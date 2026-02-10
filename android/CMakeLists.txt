cmake_minimum_required(VERSION 3.10)
project(NitroReshuffle)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 20)

# Define the library
add_library(NitroReshuffle SHARED
  # Your C++ implementation
  ../cpp/HybridReshuffle.cpp
)

# Add header search paths
target_include_directories(NitroReshuffle PRIVATE
  ../cpp
)

# Include Nitrogen autolinking (add generated specs, link NitroModules, etc.)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/NitroReshuffle+autolinking.cmake)
