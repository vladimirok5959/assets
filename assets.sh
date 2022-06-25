#!/bin/bash

SOURCE_FILE=${1}
TARGET_FILE=${2}

# Check if source file is set
if [[ "${SOURCE_FILE}" = "" ]]; then
    echo "Source file is not set"
    exit 1
fi

# Check if target file is set
if [[ "${TARGET_FILE}" = "" ]]; then
    echo "Target file is not set"
    exit 1
fi

# Check if source file exists
if [[ ! -f "${SOURCE_FILE}" ]]; then
    echo "Source file does not exists: ${SOURCE_FILE}"
    exit 1
fi

# Re-create empty target file
if [[ -f "${TARGET_FILE}" ]]; then
    rm ${TARGET_FILE}
fi
touch ${TARGET_FILE}

IFS=""
while read line; do
    if [[ ${line} == "/*"* ]]; then
        if [[ ${line} == *"*/" ]]; then
            if [[ ${line} == *"import("* ]]; then
                FILE_TO_IMPORT=$(echo "${line}" | grep -oP "/*\s?import\(\K[^)]+")
                DATA_TO_IMPORT=$(curl -s "${FILE_TO_IMPORT}")
                echo "${DATA_TO_IMPORT}" >> ${TARGET_FILE}
            else
                echo "${line}" >> ${TARGET_FILE}
            fi
        else
            echo "${line}" >> ${TARGET_FILE}
        fi
    else
        echo "${line}" >> ${TARGET_FILE}
    fi
done < ${SOURCE_FILE}
