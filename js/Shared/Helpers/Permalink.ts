import {BinaryString} from "@/Shared/Helpers/BinaryString";

class Permalink {



    static string_config(option: string)
    {
        let encode = (binary_string: BinaryString, options: any) => {
            binary_string.add_string(option);
        }

        let decode = (binary_string: BinaryString, options: any) => {

        }
    }
}