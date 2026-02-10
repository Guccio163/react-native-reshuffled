#include <jni.h>
#include "NitroReshuffleOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::reshuffle::initialize(vm);
}
