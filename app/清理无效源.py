import os
import re
import tkinter as tk
from tkinter import filedialog, ttk
import requests
import threading
import shutil
import json
import time
import urllib3

# 忽略 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def extract_host_from_js(file_content):
    # 匹配没有 // 注释的行中的 host 地址
    #host_regex = r"^(?!\s*//.*$)\s*host\s*:\s*['\"](https?://[^'\"]+)['\"]"
    host_regex = r'^(?!\s*//.*$)\s*(?:"?\s*host\s*"?\s*:\s*["\']\s*(https?://[^\s"\'(),]+)["\']\s*,?\s*$)'
    matches = re.findall(host_regex, file_content, re.MULTILINE)
    if matches:
        return matches[0]
    return None

def read_js_files_from_directory(directory_path):
    host_values = []
    for filename in os.listdir(directory_path):
        if filename.endswith('.js'):
            file_path = os.path.join(directory_path, filename)
            with open(file_path, 'r', encoding='utf-8') as file:
                file_content = file.read()
                host_value = extract_host_from_js(file_content)
                if host_value is not None:
                    host_values.append((host_value, file_path))
                else:
                    host_values.append((None, file_path))  # 记录未检测到主机的文件
    return host_values

def check_host_availability(protocol, host, result_text, js_file_path, error_folder):
    url = f"{protocol}://{host}"
    response_time = None  # 初始化 response_time 变量
    try:
        start_time = time.time()
        response = requests.get(url, timeout=5, verify=False)  # 忽略 SSL 验证
        response_time = time.time() - start_time

        # 添加对响应时间的检查
        if response_time > 5:
            status = f"响应时间超过5秒: {response_time:.2f}秒"
            shutil.move(js_file_path, os.path.join(error_folder, os.path.basename(js_file_path)))
        elif response.status_code == 200:
            status = f"可访问，响应时间: {response_time:.2f}秒"
        else:
            status = f"错误 {response.status_code}，响应时间: {response_time:.2f}秒"
            shutil.move(js_file_path, os.path.join(error_folder, os.path.basename(js_file_path)))
    except requests.exceptions.SSLError as e:
        status = f"SSL错误: {e}，响应时间: {response_time:.2f}秒" if response_time else f"SSL错误: {e}"
        shutil.move(js_file_path, os.path.join(error_folder, os.path.basename(js_file_path)))
    except requests.exceptions.ReadTimeout as e:
        status = f"读取超时: {e}，响应时间: {response_time:.2f}秒" if response_time else f"读取超时: {e}"
        shutil.move(js_file_path, os.path.join(error_folder, os.path.basename(js_file_path)))
    except requests.RequestException as e:
        status = f"请求错误: {e}，响应时间: {response_time:.2f}秒" if response_time else f"请求错误: {e}"
        shutil.move(js_file_path, os.path.join(error_folder, os.path.basename(js_file_path)))
    
    result_text.insert(tk.END, f"{url} - {status}\n")


def browse_folder():
    folder_path = filedialog.askdirectory()
    if folder_path:
        host_values = read_js_files_from_directory(folder_path)
        result_text.delete(1.0, tk.END)
        if host_values:
            result_text.insert(tk.END, f"总共找到的主机数: {len([hv for hv in host_values if hv[0] is not None])}\n\n")
            
            error_folder = os.path.join(folder_path, "error_files")
            if not os.path.exists(error_folder):
                os.makedirs(error_folder)

            no_host_files = [js_file_path for host_value, js_file_path in host_values if host_value is None]

            for host_value, js_file_path in host_values:
                if host_value is not None:
                    protocol = "http"
                    if host_value.startswith("https://"):
                        protocol = "https"
                        host_value = host_value[len("https://"):]
                    elif host_value.startswith("http://"):
                        host_value = host_value[len("http://"):]
                    
                    threading.Thread(target=check_host_availability, args=(protocol, host_value, result_text, js_file_path, error_folder)).start()

            if no_host_files:
                result_text.insert(tk.END, "\n未检测到主机的文件:\n")
                for file in no_host_files:
                    result_text.insert(tk.END, f"{file}\n")
        else:
            result_text.insert(tk.END, "在 JavaScript 文件中未找到主机值。")

def browse_json():
    json_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
    if json_path:
        process_json(json_path)

def process_json(json_path):
    error_folder = filedialog.askdirectory()
    if not error_folder:
        result_text.insert(tk.END, "未选择错误文件夹。")
        return

    with open(json_path, 'r', encoding='utf-8') as json_file:
        data = json_file.readlines()

    error_js_files = [file for file in os.listdir(error_folder) if file.endswith('.js')]

    new_data = []
    for line in data:
        stripped_line = line.strip().rstrip(',')
        if stripped_line.startswith('//'):
            new_data.append(line.strip())
            continue
        try:
            site = json.loads(stripped_line)
            ext_value = site.get('ext', '')
            if isinstance(ext_value, str):
                js_filename = ext_value.split('/')[-1]
            elif isinstance(ext_value, dict):
                js_filename = ext_value.get('path', '').split('/')[-1]
            else:
                js_filename = ''

            if js_filename in error_js_files:
                new_data.append(f"// {line.strip()}")
            else:
                new_data.append(line.strip())
        except json.JSONDecodeError:
            new_data.append(line.strip())

    with open(json_path, 'w', encoding='utf-8') as json_file:
        json_file.write("\n".join(new_data))
    
    result_text.insert(tk.END, "JSON 文件处理完成。\n")

root = tk.Tk()
root.title("JavaScript 主机提取器")

screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()

window_width = int(screen_width * 0.8)
window_height = int(screen_height * 0.8)
window_x = (screen_width - window_width) // 2
window_y = (screen_height - window_height) // 2
root.geometry(f"{window_width}x{window_height}+{window_x}+{window_y}")

scrollbar = ttk.Scrollbar(root)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

result_text = tk.Text(root, height=20, width=80, yscrollcommand=scrollbar.set)
result_text.pack(pady=10, expand=True, fill=tk.BOTH)
scrollbar.config(command=result_text.yview)

def toggle_fullscreen():
    root.attributes("-fullscreen", not root.attributes("-fullscreen"))

fullscreen_button = tk.Button(root, text="切换全屏", command=toggle_fullscreen)
fullscreen_button.pack(pady=10)

browse_button = tk.Button(root, text="浏览文件夹", command=browse_folder)
browse_button.pack(pady=10)

json_button = tk.Button(root, text="选择JSON文件并处理", command=browse_json)
json_button.pack(pady=10)

root.mainloop()
