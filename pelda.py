
import tkinter as tk
from tkinter import messagebox as MessageBox
import mysql.connector as mysql

def get():
    if e_id.get() == "":
        MessageBox.showinfo("Info", "ID mezĹ kĂśtelezĹ")
    else:
        con = mysql.connect(host=dbhost, user=dbuser, password=dbpass, database=dbname)
        cursor = con.cursor()
        cursor.execute('select * from jarmutipus where id={}'.format(e_id.get()))
        rows = cursor.fetchmany(1)
        for row in rows:
            e_name.insert(0, row[1])
            e_phone.insert(0, row[2])
        con.close()
        show()


def insert():
    if e_id.get() == "" or e_name.get() == "" or e_phone.get() == "":
        MessageBox.showinfo("Info", "Minden mezĹ kĂśtelezĹ")
    else:
        con = mysql.connect(host=dbhost, user=dbuser, password=dbpass, database=dbname)
        cursor = con.cursor()
        cursor.execute('insert into nevtel values("{}","{}","{}")'.format(e_id.get(), e_name.get(), e_phone.get()))
        cursor.execute('commit')
        e_id.delete(0, 'end')
        e_name.delete(0, 'end')
        e_phone.delete(0, 'end')
        MessageBox.showinfo('Info', 'Sikeres beszĂşrĂĄs')
        con.close()
        show()


def delete():
    if e_id.get() == "":
        MessageBox.showinfo("Info", "ID mezĹ kĂśtelezĹ")
    else:
        con = mysql.connect(host=dbhost, user=dbuser, password=dbpass, database=dbname)
        cursor = con.cursor()
        cursor.execute('delete from nevtel where id="{}"'.format(e_id.get()))
        cursor.execute('commit')
        e_id.delete(0, 'end')
        e_name.delete(0, 'end')
        e_phone.delete(0, 'end')
        MessageBox.showinfo('Info', 'TĂśrlĂŠs vĂŠgrehajtva')
        con.close()
        show()


def update():
    if e_id.get() == "" or e_name.get() == "" or e_phone.get() == "":
        MessageBox.showinfo("Info", "Minden mezĹ kĂśtelezĹ")
    else:
        con = mysql.connect(host=dbhost, user=dbuser, password=dbpass, database=dbname)
        cursor = con.cursor()
        cursor.execute('update nevtel set nev="{}", tel="{}" where id={}'.format(e_name.get(), e_phone.get(), e_id.get()))
        cursor.execute('commit')
        e_id.delete(0, 'end')
        e_name.delete(0, 'end')
        e_phone.delete(0, 'end')
        MessageBox.showinfo('Info', 'Sikeres frissĂ­tĂŠs')
        con.close()
        show()


def show():
    con = mysql.connect(host=dbhost, user=dbuser, password=dbpass, database=dbname)
    cursor = con.cursor()
    cursor.execute('select * from jarmutipus')
    rows = cursor.fetchall()
    list.delete(0, list.size())
    for row in rows:
        insertData = '{}  {}'.format(row[0], row[1])
        list.insert(list.size() + 1, insertData)
    con.close()


if __name__ == '__main__':
    dbhost = 'localhost'
    dbuser = 'root'
    dbpass = ''
    dbname = 'menetrend'

    root = tk.Tk()
    root.geometry("600x300")
    root.title("SQL teszt")

    id = tk.Label(root, text='AzonosĂ­tĂł', font=('bold', 10))
    id.place(x=20, y=30)

    name = tk.Label(root, text='NĂŠv', font=('bold', 10))
    name.place(x=20, y=60)

    phone = tk.Label(root, text='Telefon', font=('bold', 10))
    phone.place(x=20, y=90)

    e_id = tk.Entry()
    e_id.place(x=150, y=30)

    e_name = tk.Entry()
    e_name.place(x=150, y=60)

    e_phone = tk.Entry()
    e_phone.place(x=150, y=90)

    insert_button = tk.Button(root, text="BeszĂşr", font=('italic', 10), bg="white", command=insert)
    insert_button.place(x=20, y=140)

    update_button = tk.Button(root, text="FrissĂ­t", font=('italic', 10), bg="white", command=update)
    update_button.place(x=80, y=140)

    delete_button = tk.Button(root, text="TĂśrĂśl", font=('italic', 10), bg="white", command=delete)
    delete_button.place(x=140, y=140)

    get_button = tk.Button(root, text="LekĂŠr", font=('italic', 10), bg="white", command=get)
    get_button.place(x=190, y=140)

    list = tk.Listbox(root)
    list.place(x=290, y=30)

    show()
    root.mainloop()