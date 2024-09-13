class Node {
    private int value;
    private Node left;
    private Node right;


    public Node(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    public Node getRight() {
        return this.right;
    }

    public Node getLeft() {
        return this.left;
    }

    public void setLeft(Node left) {
        this.left = left;
    }


    public void setRight(Node right) {
        this.right = right;
    }

    public int getVal() {
        return this.value;
    }

}

public class BinaryTree {
    private Node root;

    public BinaryTree() {
        this.root = null;
    }

    public boolean isEmpty() {
        return this.root == null;
    }

    public void insert(int val) {
        Node node = new Node(val);
        if (this.isEmpty())
            this.root = node;
        else {
            Node current = this.root;
            Node parent = this.root;
            boolean isLeft = false;
            while (current != null) {
                parent = current;
                if (current.getVal() > val) {
                    current = current.getLeft();
                    isLeft = true;
                }
                else {
                    current = current.getRight();
                    isLeft = false;
                }
            }
            if (isLeft) 
                parent.setLeft(node);
            else
                parent.setRight(node);
        }
    }
}

