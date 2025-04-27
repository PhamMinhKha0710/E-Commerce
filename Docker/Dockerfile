FROM docker.elastic.co/elasticsearch/elasticsearch:8.7.0
COPY elasticsearch-analysis-vietnamese-8.7.0.zip /usr/share/elasticsearch/
# Ở đây mình lấy hai thư viện để khớp với hệ điều hành file.so cho x86_64 của win còn .dylib cho macos
COPY libcoccoc_tokenizer_jni.so /usr/lib/libcoccoc_tokenizer_jni.so
COPY libcoccoc_tokenizer_jni.dylib /usr/lib/libcoccoc_tokenizer_jni.dylib
# Dòng này chỉ cấu hình kiểm tra môi trường nào dùng file đó nha ae
ARG TARGETPLATFORM
RUN if [ "$TARGETPLATFORM" != "linux/amd64" ] && [ "$TARGETPLATFORM" != "linux/arm64" ]; then \
        mv /usr/lib/libcoccoc_tokenizer_jni.dylib /usr/lib/libcoccoc_tokenizer_jni.so; \
    fi
COPY dicts /usr/local/share/tokenizer/dicts
RUN cd /usr/share/elasticsearch && \
    bin/elasticsearch-plugin install --batch file:///usr/share/elasticsearch/elasticsearch-analysis-vietnamese-8.7.0.zip